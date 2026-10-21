"""Build the normalized hero dataset and download core artwork.

Sources (all cached under scripts/.cache/mlbbdex/):
  * MLBBDex API (https://mlbbdex.com/en/api-doc) - primary metadata, base stats,
    skills, skins, illustrations. Derived from the Mobile Legends Wiki (CC BY-SA).
  * Moonton GMS public hero feed - official skill icons, cooldown/cost strings,
    skill tags, and strong/weak/assist relations.
  * Mobile Legends Wiki (via Special:FilePath) - item icons.

Outputs:
  src/data/heroes.json      normalized hero records
  src/data/items.json       normalized item records
  src/data/patches.json     patch history
  public/heroes/<slug>.webp portrait
  public/splash/<slug>.webp 16:9 splash art
  public/assets/items/<slug>.webp

Run: python scripts/build_dataset.py
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
from typing import Any

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".cache", "mlbbdex")
DATA = os.path.join(ROOT, "src", "data")
PUBLIC = os.path.join(ROOT, "public")

DEX = "https://mlbbdex.com"

LANE_MAP = {
    "gold": "Gold Lane",
    "exp": "Exp Lane",
    "mid": "Mid Lane",
    "jungle": "Jungle",
    "roam": "Roam",
}
ROLE_ORDER = ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"]

SESSION = requests.Session()
SESSION.headers.update({"Accept": "*/*"})


def load(name: str) -> Any:
    with open(os.path.join(CACHE, name), encoding="utf-8") as f:
        return json.load(f)


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def clean_text(value: str | None) -> str:
    """Strip wiki markup and HTML tags while keeping readable prose."""
    if not value:
        return ""
    text = re.sub(r"<[^>]+>", "", value)
    text = text.replace("[[", "").replace("]]", "")
    text = re.sub(r"\[[^\]]*\|([^\]]*)\]", r"\1", text)
    text = re.sub(r"'''?", "", text)
    text = re.sub(r"\[(?:unknown|amount|duration|speed)[^\]]*\]", "", text, flags=re.I)
    return re.sub(r"\s+", " ", text).strip()


def to_number(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(str(value).replace(",", "").strip())
    except (TypeError, ValueError):
        return None


def parse_release(value: str | None) -> tuple[str | None, int | None]:
    if not value or value.strip().upper() == "TBA":
        return None, None
    raw = value.strip()
    year_match = re.search(r"(19|20)\d{2}", raw)
    year = int(year_match.group(0)) if year_match else None
    for fmt in ("%d %B %Y", "%d %b %Y", "%B %Y", "%b %Y", "%Y-%m-%d"):
        try:
            from datetime import datetime

            dt = datetime.strptime(raw, fmt)
            return dt.strftime("%Y-%m-%d"), dt.year
        except ValueError:
            continue
    return (raw if year else None), year


def normalize_lanes(lanes: list[str] | None) -> list[str]:
    out: list[str] = []
    for lane in lanes or []:
        mapped = LANE_MAP.get(lane.strip().lower())
        if mapped and mapped not in out:
            out.append(mapped)
    return out


def normalize_roles(roles: list[str] | None) -> list[str]:
    out = []
    for role in roles or []:
        title = role.strip().title()
        if title == "Marksman":
            title = "Marksman"
        if title in ROLE_ORDER and title not in out:
            out.append(title)
    return sorted(out, key=lambda r: ROLE_ORDER.index(r))


def parse_skill_cost(raw: str | None) -> tuple[str | None, str | None]:
    if not raw:
        return None, None
    text = raw.strip()
    cd = re.search(r"CD[:\s]*([0-9./\s-]+)", text, flags=re.I)
    cost = re.search(r"(?:Mana|Energy|Rage|Cost)[^:]*[:\s]*([0-9./\s-]+)", text, flags=re.I)
    return (
        cd.group(1).strip() if cd else None,
        cost.group(1).strip() if cost else None,
    )


def moonton_skill_index(records: list[dict]) -> dict[str, dict]:
    """Index Moonton skills by hero name -> normalized skill name.

    Form-swapping heroes (e.g. Hirara, Beatrix) repeat skill names across
    groups, so the first occurrence wins.
    """
    index: dict[str, dict[str, dict]] = {}
    for record in records:
        data = record.get("data") or {}
        hero_data = ((data.get("hero") or {}).get("data")) or {}
        name = hero_data.get("name")
        if not name:
            continue
        skills: dict[str, dict] = {}
        for group in hero_data.get("heroskilllist") or []:
            for skill in group.get("skilllist") or []:
                skill_name = clean_text(skill.get("skillname"))
                if not skill_name:
                    continue
                key = slugify(skill_name)
                if key in skills:
                    continue
                cooldown, cost = parse_skill_cost(skill.get("skillcd&cost"))
                skills[key] = {
                    "icon": skill.get("skillicon") or None,
                    "cooldown": cooldown,
                    "cost": cost,
                    "tags": [t.get("tagname") for t in skill.get("skilltag") or [] if t.get("tagname")],
                }
        index[name] = skills
    return index


def moonton_stories(records: list[dict]) -> dict[str, str]:
    """Official English hero blurbs keyed by hero name."""
    out: dict[str, str] = {}
    for record in records:
        hero_data = (((record.get("data") or {}).get("hero") or {}).get("data")) or {}
        name = hero_data.get("name")
        story = clean_text(hero_data.get("story"))
        if name and story:
            out[name] = story
    return out


def moonton_relations(records: list[dict], by_mlid: dict[int, str]) -> dict[str, dict]:
    """Map Moonton hero id relations to internal slugs."""
    out: dict[str, dict] = {}
    for record in records:
        data = record.get("data") or {}
        hero_data = ((data.get("hero") or {}).get("data")) or {}
        name = hero_data.get("name")
        if not name:
            continue
        relation = data.get("relation") or {}
        entry: dict[str, Any] = {"notes": {}}
        for key, target in (("assist", "synergies"), ("strong", "strongAgainst"), ("weak", "weakAgainst")):
            block = relation.get(key)
            if isinstance(block, list):
                block = block[0] if block else {}
            block = block or {}
            ids = block.get("target_hero_id") or []
            if not isinstance(ids, list):
                ids = [ids]
            slugs = []
            for hid in ids:
                try:
                    slug = by_mlid.get(int(hid))
                except (TypeError, ValueError):
                    continue
                if slug and slug not in slugs:
                    slugs.append(slug)
            entry[target] = slugs
            note = clean_text(block.get("desc"))
            if note:
                entry["notes"][key] = note
        out[name] = entry
    return out


def download(url: str, dest: str, *, no_ua: bool = False) -> bool:
    if os.path.exists(dest) and os.path.getsize(dest) > 1024:
        return True
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    headers = {"User-Agent": ""} if no_ua else {}
    for attempt in range(4):
        try:
            response = requests.get(url, headers=headers, timeout=45)
            if response.status_code == 200 and len(response.content) > 1024:
                with open(dest, "wb") as f:
                    f.write(response.content)
                return True
            if response.status_code in (403, 429):
                time.sleep(2 * (attempt + 1))
                continue
            return False
        except requests.RequestException:
            time.sleep(2 * (attempt + 1))
    return False


def main() -> None:
    details = load("details-merged.json")
    moonton = load("moonton-heroes.json")["data"]["records"]

    # mlid -> slug, used to resolve Moonton numeric relations
    by_mlid: dict[int, str] = {}
    for slug, hero in details.items():
        mlid = None
        for record in moonton:
            if (record["data"]["hero"]["data"].get("name") or "").lower() == hero["name"].lower():
                mlid = record["data"]["hero_id"]
                break
        if mlid:
            by_mlid[int(mlid)] = slug

    skill_index = moonton_skill_index(moonton)
    stories = moonton_stories(moonton)
    relations = moonton_relations(moonton, by_mlid)

    os.makedirs(os.path.join(PUBLIC, "heroes"), exist_ok=True)
    os.makedirs(os.path.join(PUBLIC, "splash"), exist_ok=True)

    heroes = []
    missing_splash = []
    for slug, raw in sorted(details.items(), key=lambda kv: kv[1]["name"].lower()):
        name = raw["name"]
        release, release_year = parse_release(raw.get("release"))
        stats_raw = raw.get("stats") or {}

        def pair(base: str) -> list[float] | None:
            low = to_number(stats_raw.get(f"{base}1"))
            high = to_number(stats_raw.get(f"{base}15"))
            if low is None and high is None:
                return None
            return [low if low is not None else 0, high if high is not None else low or 0]

        stats = {
            "hp": pair("hp"),
            "hpRegen": to_number(stats_raw.get("hp_regen1")),
            "mana": pair("mana"),
            "physicalAttack": pair("physical_atk"),
            "physicalDefense": pair("physical_def"),
            "magicDefense": pair("magic_def"),
            "movementSpeed": to_number(stats_raw.get("movement_spd")),
            "attackRange": to_number(stats_raw.get("basic_atk_range")),
        }

        moon_skills = skill_index.get(name, {})
        skills = []
        seen_skill_names: set[str] = set()
        raw_skills = raw.get("skills") or []
        for idx, skill in enumerate(raw_skills):
            skill_name = clean_text(skill.get("name"))
            key = slugify(skill_name)
            if key in seen_skill_names:
                continue
            seen_skill_names.add(key)
            extra = moon_skills.get(key, {})
            tags = extra.get("tags") or []
            if idx == 0:
                kind = "passive"
            elif idx == len(raw_skills) - 1 and len(raw_skills) > 2:
                kind = "ultimate"
            else:
                kind = "active"
            if "Passive" in tags:
                kind = "passive"
            skills.append(
                {
                    "id": f"{slug}-skill-{len(skills) + 1}",
                    "name": skill_name,
                    "type": kind,
                    "description": clean_text(skill.get("description")),
                    "icon": extra.get("icon"),
                    "cooldown": extra.get("cooldown"),
                    "cost": extra.get("cost"),
                    "tags": tags,
                }
            )

        # Moonton exposes combo/form skills (e.g. Hirara, Beatrix) that MLBBDex
        # collapses into one entry. Add only the ones with real artwork.
        for skill_key, extra in moon_skills.items():
            if skill_key in seen_skill_names or not extra.get("icon"):
                continue
            seen_skill_names.add(skill_key)
            skills.append(
                {
                    "id": f"{slug}-skill-{len(skills) + 1}",
                    "name": skill_key.replace("-", " ").title(),
                    "type": "active",
                    "description": "",
                    "icon": extra.get("icon"),
                    "cooldown": extra.get("cooldown"),
                    "cost": extra.get("cost"),
                    "tags": extra.get("tags") or [],
                }
            )

        images = raw.get("images") or {}
        portrait_url = DEX + images.get("portrait", "") if images.get("portrait") else None
        icon_url = DEX + images.get("icon", "") if images.get("icon") else None

        illustrations = raw.get("illustrations") or {}
        splash_rel = next(iter(illustrations.values()), None)
        splash_url = DEX + splash_rel if splash_rel else None

        portrait_path = f"/heroes/{slug}.webp"
        splash_path = f"/splash/{slug}.webp"

        if portrait_url and not download(portrait_url, os.path.join(PUBLIC, "heroes", f"{slug}.webp")):
            portrait_path = None  # type: ignore[assignment]
        if splash_url:
            if not download(splash_url, os.path.join(PUBLIC, "splash", f"{slug}.webp")):
                splash_path = portrait_path  # type: ignore[assignment]
        else:
            splash_path = portrait_path  # type: ignore[assignment]
            missing_splash.append(slug)

        skin_images = images.get("skins") or {}
        skins = []
        for skin in raw.get("skins") or []:
            rel = skin_images.get(str(skin.get("id")))
            skins.append(
                {
                    "id": str(skin.get("id")),
                    "name": clean_text(skin.get("name")),
                    "release": skin.get("release"),
                    "availability": skin.get("availability"),
                    "rarity": skin.get("rarity"),
                    "label": skin.get("label"),
                    "price": skin.get("price") or {},
                    "image": DEX + rel if rel else None,
                }
            )
        skins.sort(key=lambda item: (len(item["id"]), item["id"]))

        gallery = [
            {"name": clean_text(illus_name), "image": DEX + rel}
            for illus_name, rel in illustrations.items()
            if rel
        ]

        relation = relations.get(name, {})
        ratings = raw.get("ratings") or {}
        # MLBBDex analysis prose is French-only. Do not ship untranslated text:
        # the app uses Moonton's official English story and relation notes instead.
        analysis = None

        heroes.append(
            {
                "id": slug,
                "slug": slug,
                "name": name,
                "title": clean_text(raw.get("title")) or None,
                "roles": normalize_roles(raw.get("roles")),
                "lanes": normalize_lanes(raw.get("lanes")),
                "specialties": [clean_text(s) for s in raw.get("specialties") or [] if s],
                "release": release,
                "releaseYear": release_year,
                "resource": (raw.get("resource") or "").replace("Resource#Rage/Indicator|None", "None") or None,
                "damageType": {"Phyiscal": "Physical"}.get(raw.get("damageType"), raw.get("damageType")),
                "attackType": raw.get("attackType"),
                "region": clean_text(raw.get("region")) or None,
                "ratings": {
                    "offense": ratings.get("offense"),
                    "durability": ratings.get("durability"),
                    "abilityEffects": ratings.get("abilityEffects"),
                    "difficulty": ratings.get("difficulty"),
                },
                "stats": stats,
                "skills": skills,
                "portrait": portrait_path,
                "icon": portrait_path,
                "splash": splash_path,
                "skins": skins,
                "gallery": gallery,
                "lore": stories.get(name) or "",
                "counters": relation.get("weakAgainst", []),
                "synergies": relation.get("synergies", []),
                "strongAgainst": relation.get("strongAgainst", []),
                "weakAgainst": relation.get("weakAgainst", []),
                "relationNotes": relation.get("notes", {}),
                "analysis": analysis,
                "hasAnalysis": bool(analysis),
            }
        )

    with open(os.path.join(DATA, "heroes.json"), "w", encoding="utf-8") as f:
        json.dump(heroes, f, ensure_ascii=False, indent=1)

    # ---- items ----
    items_raw = SESSION.get(f"{DEX}/api/v1/items", timeout=60).json()["data"]
    item_images = load("item-images.json")
    os.makedirs(os.path.join(PUBLIC, "assets", "items"), exist_ok=True)
    items = []
    for item in items_raw:
        name = item["name"]
        slug = item["slug"]
        rel = item_images.get(name)
        local = f"/assets/items/{slug}.webp"
        if rel and download(rel, os.path.join(PUBLIC, "assets", "items", f"{slug}.webp"), no_ua=True):
            image = local
        else:
            image = None
        items.append(
            {
                "id": slug,
                "slug": slug,
                "name": name,
                "summary": clean_text(item.get("summary")),
                "category": item.get("category"),
                "price": item.get("price"),
                "bonus": clean_text(item.get("bonus")),
                "passive": clean_text(item.get("passive")),
                "unique": clean_text(item.get("unique")),
                "active": clean_text(item.get("active")),
                "recipe": item.get("recipe") or [],
                "bestFor": item.get("bestFor"),
                "image": image,
            }
        )
    with open(os.path.join(DATA, "items.json"), "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)

    # ---- patches ----
    patches_raw = SESSION.get(f"{DEX}/api/v1/patches", timeout=60).json()["data"]
    patches = [
        {
            "version": p.get("version"),
            "title": p.get("title"),
            "link": p.get("link"),
            "date": p.get("date"),
        }
        for p in patches_raw
        if p.get("version")
    ]
    with open(os.path.join(DATA, "patches.json"), "w", encoding="utf-8") as f:
        json.dump(patches, f, ensure_ascii=False, indent=1)

    print(f"heroes: {len(heroes)}")
    print(f"items: {len(items)} (with art: {sum(1 for i in items if i['image'])})")
    print(f"patches: {len(patches)}")
    print(f"heroes without dedicated splash: {len(missing_splash)}")
    print(f"skills total: {sum(len(h['skills']) for h in heroes)}")
    print(f"skins total: {sum(len(h['skins']) for h in heroes)}")
    print(f"heroes with relations: {sum(1 for h in heroes if h['strongAgainst'] or h['weakAgainst'])}")


if __name__ == "__main__":
    sys.exit(main())

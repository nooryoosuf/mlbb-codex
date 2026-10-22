"""Collect full-width 16:9 skin splash artwork for all heroes.

Each skin gets a 1280x720 WebP illustration from MLBBDex's Wiki-derived
gallery (used for thumbnails) and, when the Mobile Legends Fandom Wiki has a
landscape splash, a high-resolution URL up to 2560px wide (used for hero
banners and full-screen artwork). Skins without a Wiki splash keep the MLBBDex
artwork as their only source.

Usage:
    python scripts/fetch_skin_art.py
    python scripts/fetch_skin_art.py --no-hd   # skip the Wiki HD pass
"""
import argparse
import difflib
import json
import os
import re
import time
from datetime import date

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEROES_PATH = os.path.join(ROOT, "src", "data", "heroes.json")
OUT = os.path.join(ROOT, "src", "data", "skin_art.json")

WIKI_API = "https://mobile-legends.fandom.com/api.php"
WIKI_TARGET_WIDTH = 2560
WIKI_MIN_WIDTH = 1280
WIKI_MIN_RATIO = 1.6
WIKI_MAX_RATIO = 1.86
WIKI_USER_AGENT = "mlbb-codex/1.0 (+https://github.com/nooryoosuf/mlbb-codex)"

# Localized / renamed skin titles between the skin table and gallery illustrations
ALIASES: dict[tuple[str, str], str] = {
    ("atlas", "935"): "Rune Sentinel",
    ("aurora", "363"): "Foxy Lady",
    ("baxia", "874"): "Ba-rista",
    ("beatrix", "1056"): "Stellar Brilliance",
    ("benedetta", "973"): "Street Blow",
    ("claude", "655"): "Summer Chill",
    ("clint", "132"): "Summer Blast",
    ("eudora", "152"): "Vivo Selfie Goddess",
    ("fanny", "176"): "Summer Rescue",
    ("freya", "102210"): "Galatic Vanquisher",
    ("gatotkaca", "411"): "Mighty Guardian",
    ("helcurt", "512"): "Exoracial Executioner",
    ("hilda", "356"): "Bass Crazy",
    ("ixia", "1211"): "Arclight Outlaw",
    ("kagura", "255"): "Soryu Maiden",
    ("layla", "101812"): "Midnight Waltz",
    ("lylia", "861"): "Little Wizard",
    ("martis", "581"): "Asura King",
    ("minsitthar", "745"): "Crimson Lion",
    ("miya", "100115"): "Arrow of Spring",
    ("moskov", "103111"): "Infernal Wyrmlord",
    ("nana", "057"): "Summer Fun",
    ("roger", "395"): "Phantom Pirate",
    ("roger", "398"): "Fiend Haunter",
    ("valir", "573"): "Shikigami Summoner",
    ("yi-sun-shin", "305"): "Lone Destructor",
}

# Direct Fandom Wiki splash URLs for the two skins not in MLBBDex gallery
WIKI_FALLBACKS: dict[tuple[str, str], dict] = {
    ("helcurt", "517"): {
        "url": "https://static.wikia.nocookie.net/mobile-legends/images/a/a9/Helcurt_%28Cyber_Infiltrator%29.jpg/revision/latest?cb=20250821115351",
        "width": 947,
        "height": 540,
    },
    ("franco", "102"): {
        "url": "https://static.wikia.nocookie.net/mobile-legends/images/c/c3/Franco_%28Masterchef%29.jpg/revision/latest?cb=20211209065151",
        "width": 607,
        "height": 1080,
    },
}


def normalize(value: str) -> str:
    value = value.replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def wiki_skin_name(filename: str, hero_name: str) -> str | None:
    """Pull the skin name out of a wiki file such as `Hero (Skin Name).jpg`."""
    base = re.sub(r"\.(?:jpe?g|png|webp)$", "", filename, flags=re.IGNORECASE).replace("_", " ")
    match = re.match(rf"^{re.escape(hero_name)}\s*\(([^()]*)\)", base, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    match = re.match(rf"^{re.escape(hero_name)}\s*[- ]\s*(.+)$", base, re.IGNORECASE)
    if match:
        return re.sub(r"\b(?:wall|wallpaper|splash)\b", "", match.group(1), flags=re.IGNORECASE).strip()
    return None


def is_archived_art(filename: str) -> bool:
    """True for wiki files that archive an older version of a splash."""
    return bool(
        re.search(r"\(\s*(?:19|20)\d{2}\s*(?:[-–]\s*(?:19|20)\d{2})?\s*\)", filename)
        or re.search(r";\s*(?:19|20)\d{2}\s*[-–]\s*(?:19|20)\d{2}", filename)
    )


def is_wallpaper(filename: str) -> bool:
    return bool(re.search(r"[_ \-]wall(?:paper)?(?:\.[a-z0-9]+)?$", filename, re.IGNORECASE))


def fetch_wiki_images(session: requests.Session, hero_name: str) -> list[dict]:
    images: list[dict] = []
    params = {
        "action": "query",
        "list": "allimages",
        "aiprefix": hero_name,
        "ailimit": "500",
        "aiprop": "url|size|mime",
        "format": "json",
    }
    for _ in range(6):
        try:
            response = session.get(WIKI_API, params=params, timeout=45)
            response.raise_for_status()
            payload = response.json()
        except requests.RequestException as exc:
            print(f"  wiki request failed for {hero_name}: {exc}")
            break
        images.extend(payload.get("query", {}).get("allimages", []))
        continuation = payload.get("continue", {}).get("aicontinue")
        if not continuation:
            break
        params["aicontinue"] = continuation
    return images


def wiki_candidates(session: requests.Session, hero: dict) -> list[dict]:
    candidates: list[dict] = []
    for item in fetch_wiki_images(session, hero["name"]):
        if item.get("mime") not in {"image/jpeg", "image/png", "image/webp"}:
            continue
        width = int(item.get("width") or 0)
        height = int(item.get("height") or 0)
        if width < WIKI_MIN_WIDTH or height <= 0:
            continue
        ratio = width / height
        if not WIKI_MIN_RATIO <= ratio <= WIKI_MAX_RATIO:
            continue
        skin_name = wiki_skin_name(item["name"], hero["name"])
        if not skin_name:
            continue
        candidates.append(
            {
                "url": item["url"],
                "width": width,
                "height": height,
                "ratio": ratio,
                "skin": skin_name,
                "archived": is_archived_art(item["name"]),
                "wallpaper": is_wallpaper(item["name"]),
            }
        )
    return candidates


def match_candidates(skin_name: str, candidates: list[dict]) -> list[dict]:
    target = normalize(skin_name)
    exact = [candidate for candidate in candidates if normalize(candidate["skin"]) == target]
    if exact:
        return exact

    best_ratio = 0.0
    best: list[dict] = []
    for candidate in candidates:
        current = normalize(candidate["skin"])
        if len(current) < 5:
            continue
        ratio = difflib.SequenceMatcher(None, target, current).ratio()
        if (target in current or current in target) and min(len(target), len(current)) / max(len(target), len(current)) > 0.6:
            ratio = max(ratio, 0.9)
        if ratio > best_ratio + 1e-9:
            best_ratio = ratio
            best = [candidate]
        elif abs(ratio - best_ratio) < 1e-9:
            best.append(candidate)
    return best if best_ratio >= 0.84 else []


def pick_candidate(candidates: list[dict]) -> dict:
    return min(
        candidates,
        key=lambda candidate: (
            1 if candidate["archived"] else 0,
            1 if candidate["wallpaper"] else 0,
            -candidate["width"],
            abs(candidate["ratio"] - 16 / 9),
        ),
    )


def scaled_wiki_url(url: str) -> str:
    base, _, query = url.partition("?")
    base = re.sub(r"/revision/latest(?:/.*)?$", "", base)
    scaled = f"{base}/revision/latest/scale-to-width-down/{WIKI_TARGET_WIDTH}"
    return f"{scaled}?{query}" if query else scaled


def attach_hd_art(heroes: list[dict], result: dict, session: requests.Session) -> int:
    matched = 0
    for hero in heroes:
        slug = hero["slug"]
        if slug not in result or not hero.get("skins"):
            continue
        candidates = wiki_candidates(session, hero)
        if not candidates:
            continue
        for skin in hero["skins"]:
            sid = str(skin["id"])
            art = result[slug].get(sid)
            if not art:
                continue
            picks = match_candidates(skin["name"], candidates)
            if not picks:
                continue
            picked = pick_candidate(picks)
            hd_width = min(picked["width"], WIKI_TARGET_WIDTH)
            hd_height = round(picked["height"] * hd_width / picked["width"])
            art["hdUrl"] = scaled_wiki_url(picked["url"])
            art["hdWidth"] = hd_width
            art["hdHeight"] = hd_height
            matched += 1
        time.sleep(0.15)
    return matched


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--no-hd", action="store_true", help="skip the Fandom Wiki HD pass")
    args = parser.parse_args()

    heroes = json.load(open(HEROES_PATH, encoding="utf-8"))
    result: dict[str, dict] = {}
    total = 0
    covered = 0

    for hero in heroes:
        slug = hero["slug"]
        gallery = {normalize(item["name"]): item["image"] for item in hero.get("gallery", []) if item.get("image")}
        for skin in hero.get("skins", []):
            total += 1
            sid = str(skin["id"])
            target_name = ALIASES.get((slug, sid), skin["name"])
            url = gallery.get(normalize(target_name))
            if url:
                result.setdefault(slug, {})[sid] = {
                    "url": url,
                    "width": 1280,
                    "height": 720,
                }
                covered += 1
            elif (slug, sid) in WIKI_FALLBACKS:
                result.setdefault(slug, {})[sid] = WIKI_FALLBACKS[(slug, sid)]
                covered += 1

    hd_matched = 0
    if not args.no_hd:
        session = requests.Session()
        session.headers.update({"User-Agent": WIKI_USER_AGENT})
        hd_matched = attach_hd_art(heroes, result, session)

    payload = {
        "source": "MLBBDex & Mobile Legends Wiki (Fandom), CC BY-SA",
        "fetched": date.today().isoformat(),
        "skins": result,
    }
    json.dump(payload, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"skins={total} covered={covered} ({covered / total:.1%})")
    print(f"hd={hd_matched} ({hd_matched / total:.1%})")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()

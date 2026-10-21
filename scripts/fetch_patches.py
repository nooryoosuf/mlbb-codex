"""Fetch recent patch notes from the Mobile Legends Wiki and flatten them to text.

The wiki keeps each patch on its own page. This script pulls the wikitext for
the newest patches (by version), extracts the release date, the "what's new"
bullets, the designers' note, and the top-level sections, then writes
src/data/patch_notes.json for the homepage and /patches page.

Usage:
    python scripts/fetch_patches.py [--refresh] [--limit 6]

Data: Mobile Legends Wiki (Fandom), CC BY-SA.
"""
import html
import json
import os
import re
import sys
import time

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".cache", "fandom")
OUT = os.path.join(ROOT, "src", "data", "patch_notes.json")
API = "https://mobilelegends.fandom.com/api.php"
UA = {"User-Agent": "mlbb-codex/1.0 (+https://github.com/nooryoosuf/mlbb-codex)"}
SESSION = requests.Session()
SESSION.headers.update(UA)
MAX_SECTION_CHARS = 6000

os.makedirs(CACHE, exist_ok=True)


def striptags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value)


def clean(value: str) -> str:
    value = re.sub(r"<ref[^>]*>.*?</ref>", "", value, flags=re.S)
    value = re.sub(r"<ref[^>]*/>", "", value)
    value = re.sub(r"<!--.*?-->", "", value, flags=re.S)
    value = re.sub(r"\[\[(?:File|Image):[^\]]*\]\]", "", value, flags=re.I)

    value = re.sub(r"\{\{pci\|buff\}\}", "Buff", value, flags=re.I)
    value = re.sub(r"\{\{pci\|nerf\}\}", "Nerf", value, flags=re.I)
    value = re.sub(r"\{\{pci\|adjust\}\}", "Adjust", value, flags=re.I)
    value = re.sub(r"\{\{pci\|rework\}\}", "Rework", value, flags=re.I)
    value = re.sub(r"\{\{(?:hi|ai|hc|hii)\|([^}|]+)(?:\|[^}]*)?\}\}", r"\1", value, flags=re.I)
    value = re.sub(r"\{\{([^{}]*)\}\}", "", value)

    value = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\2", value)
    value = re.sub(r"\[\[([^\]]+)\]\]", r"\1", value)
    value = re.sub(r"\[(?:https?://\S+)\s+([^\]]+)\]", r"\1", value)
    value = re.sub(r"\[(?:https?://\S+)\]", "", value)

    value = value.replace("'''", "").replace("''", "")
    value = re.sub(r"<[^>]+>", "", value)
    value = html.unescape(value)
    value = re.sub(r"\{\|.*?\|\}", "", value, flags=re.S)

    lines = []
    for line in value.splitlines():
        line = line.strip()
        if not line:
            lines.append("")
            continue
        if line.startswith(("*", "#")):
            line = "• " + re.sub(r"^[#*]+\s*", "", line)
        lines.append(line)

    value = "\n".join(lines)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def fetch_wikitext(page: str) -> str:
    safe = re.sub(r"[^a-z0-9._-]+", "-", page.lower())
    path = os.path.join(CACHE, f"patch-{safe}.json")
    if os.path.exists(path) and "--refresh" not in sys.argv:
        return json.load(open(path, encoding="utf-8"))["wikitext"]

    for attempt in range(5):
        try:
            response = SESSION.get(
                API,
                params={
                    "action": "parse",
                    "page": page,
                    "prop": "wikitext",
                    "format": "json",
                    "formatversion": "2",
                },
                timeout=60,
            )
            response.raise_for_status()
            data = response.json()
            if "error" in data:
                raise RuntimeError(data["error"].get("info", "parse error"))
            wikitext = data["parse"]["wikitext"]
            json.dump({"wikitext": wikitext}, open(path, "w", encoding="utf-8"), ensure_ascii=False)
            time.sleep(0.3)
            return wikitext
        except Exception as exc:
            print(f"  retry {attempt + 1} for {page}: {exc}", flush=True)
            time.sleep(2 + attempt * 2)
    return ""


def infobox_fields(text: str) -> dict[str, str]:
    match = re.search(r"\{\{Infobox patch note(.*?)\n?\}\}", text, flags=re.S | re.I)
    if not match:
        return {}
    block = match.group(1)
    keys = list(re.finditer(r"\|([A-Za-z_' ]+?)\s*=", block))
    fields: dict[str, str] = {}
    for index, key in enumerate(keys):
        end = keys[index + 1].start() if index + 1 < len(keys) else len(block)
        fields[key.group(1).strip().lower()] = block[key.end() : end].strip()
    return fields


def split_sections(wikitext: str) -> list[dict]:
    body = re.sub(r"\{\{Infobox.*?\n\}\}", "", wikitext, flags=re.S)
    pattern = re.compile(r"^(==+)\s*(.*?)\s*\1\s*$", re.M)
    matches = list(pattern.finditer(body))
    sections = []
    for index, match in enumerate(matches):
        if len(match.group(1)) != 2:
            continue
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        title = clean(match.group(2))
        content = clean(body[start:end])
        if not title or title.lower() in {"references", "undocumented changes"}:
            continue
        sections.append({"title": title, "body": content[:MAX_SECTION_CHARS]})
    return sections


def hero_change_highlights(sections: list[dict], hero_names: set[str]) -> list[str]:
    """Summarise 'Akai Nerf' style headings into three tidy lines."""
    buckets: dict[str, list[str]] = {"buff": [], "nerf": [], "adjust": []}
    labels = {"buff": "Buffed", "nerf": "Nerfed", "adjust": "Adjusted"}
    for section in sections:
        if "hero" not in section["title"].lower():
            continue
        for line in section["body"].splitlines():
            match = re.match(r"^([A-Za-z][A-Za-z' .-]{1,30}?)\s+(Buff|Nerf|Adjust|Rework)$", line.strip())
            if not match:
                continue
            name = match.group(1).strip()
            if name.lower() not in hero_names:
                continue
            kind = match.group(2).lower()
            if kind == "rework":
                kind = "adjust"
            if name not in buckets[kind]:
                buckets[kind].append(name)
    highlights = []
    for kind, names in buckets.items():
        if not names:
            continue
        shown = ", ".join(names[:6])
        extra = f" +{len(names) - 6}" if len(names) > 6 else ""
        highlights.append(f"{labels[kind]}: {shown}{extra}.")
    return highlights


def main() -> None:
    limit = 6
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])

    index = json.load(open(os.path.join(ROOT, "src", "data", "patches.json"), encoding="utf-8"))
    newest = index[:limit]
    hero_names = {
        hero["name"].lower()
        for hero in json.load(open(os.path.join(ROOT, "src", "data", "heroes.json"), encoding="utf-8"))
    }

    patches = []
    for entry in newest:
        version = entry["version"]
        page = f"Patch Notes {version}"
        print(f"fetching {page}...", flush=True)
        wikitext = fetch_wikitext(page)
        if not wikitext:
            print(f"  skipped {version}: no wikitext", flush=True)
            continue

        fields = infobox_fields(wikitext)
        date = clean(fields.get("release_date", "")) or None
        whats_new_raw = fields.get("what's_new", "")
        highlights = [
            re.sub(r"^[#*\s]+", "", clean(line)).strip(" •")
            for line in whats_new_raw.splitlines()
            if clean(re.sub(r"^[#*]\s*", "", line)).strip()
        ]
        highlights = [item for item in highlights if item and not item.endswith(":")][:6]

        sections = split_sections(wikitext)
        section_titles = {
            re.sub(r"^(?:[ivx]+|[0-9]+)[.)]\s*", "", section["title"], flags=re.I).lower().rstrip(".: ")
            for section in sections
        }
        highlights = [
            item
            for item in highlights
            if re.sub(r"^(?:[ivx]+|[0-9]+)[.)]\s*", "", item, flags=re.I).lower().rstrip(".: ") not in section_titles
        ]
        body_start = re.sub(r"\{\{Infobox.*?(\n|\|)\}\}", "", wikitext, flags=re.S).split("==", 1)[0]
        intro = clean(body_start)

        designers = next(
            (section["body"] for section in sections if "designer" in section["title"].lower()),
            "",
        )
        summary = hero_change_highlights(sections, hero_names)
        seen = set(highlights)
        highlights += [line for line in summary if line not in seen]
        if not highlights:
            source = designers or intro
            sentences = re.split(r"(?<=[.!?])\s+", source)
            meaningful = [sentence for sentence in sentences if len(sentence) > 45]
            if meaningful:
                highlights = meaningful[:4]
        highlights = highlights[:6]

        markers = re.findall(r"\{\{pci\|(buff|nerf|adjust|rework)\}\}", wikitext, flags=re.I)
        changes = {
            "buff": sum(1 for marker in markers if marker.lower() == "buff"),
            "nerf": sum(1 for marker in markers if marker.lower() == "nerf"),
            "adjust": sum(1 for marker in markers if marker.lower() in {"adjust", "rework"}),
        }

        patches.append(
            {
                "version": version,
                "title": entry.get("title") or page,
                "link": entry.get("link") or f"https://mobilelegends.fandom.com/wiki/{page.replace(' ', '_')}",
                "date": date,
                "highlights": highlights,
                "intro": intro[:1200],
                "designers": designers[:1600],
                "changes": changes,
                "sections": sections,
            }
        )

    out = {
        "source": "Mobile Legends Wiki (Fandom)",
        "attribution": "Patch notes adapted from the Mobile Legends Wiki (CC BY-SA).",
        "patches": patches,
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"wrote {len(patches)} patches to {OUT}")
    for patch in patches:
        print(f"  {patch['version']}: {patch['date']} | {len(patch['sections'])} sections | {patch['changes']}")


if __name__ == "__main__":
    main()

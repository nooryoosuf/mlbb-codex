"""Collect full-resolution 9:16 skin artwork from the Mobile Legends Wiki.

The official Wiki stores two renders per skin: a 16:9 splash and a vertical
9:16 portrait. MLBBDex only ships 240x390 thumbnails, so this script resolves
the vertical "poster" files and writes their original URLs to
src/data/skin_art.json. Skins without a vertical render are simply omitted and
the UI falls back to the local thumbnail.

Usage:
    python scripts/fetch_skin_art.py [--refresh]

Data: Mobile Legends Wiki (Fandom), CC BY-SA.
"""
import json
import os
import re
import sys
import time
from collections import Counter

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".cache", "fandom")
OUT = os.path.join(ROOT, "src", "data", "skin_art.json")
API = "https://mobilelegends.fandom.com/api.php"
UA = {"User-Agent": "mlbb-codex/1.0 (+https://github.com/nooryoosuf/mlbb-codex)"}
IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp")
MIN_RATIO, MAX_RATIO = 0.53, 0.60
MIN_HEIGHT = 500

os.makedirs(CACHE, exist_ok=True)
SESSION = requests.Session()
SESSION.headers.update(UA)


def api(params: dict, retries: int = 5) -> dict:
    params = {**params, "format": "json", "formatversion": "2"}
    backoff = 2.0
    for attempt in range(retries):
        try:
            response = SESSION.get(API, params=params, timeout=60)
            response.raise_for_status()
            time.sleep(0.25)
            return response.json()
        except requests.RequestException as exc:
            print(f"  retry {attempt + 1}: {exc}", flush=True)
            time.sleep(backoff)
            backoff = min(backoff * 2, 30)
    raise RuntimeError(f"Fandom API failed for {params}")


def chunks(items, size=50):
    for index in range(0, len(items), size):
        yield items[index : index + size]


def normalize(value: str) -> str:
    value = value.replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def is_vertical(info: dict) -> bool:
    width, height = info.get("width") or 0, info.get("height") or 0
    if height < MIN_HEIGHT or not width:
        return False
    return MIN_RATIO <= width / height <= MAX_RATIO


def imageinfo(titles: list[str]) -> dict[str, dict]:
    found: dict[str, dict] = {}
    for batch in chunks(sorted(set(titles))):
        response = api(
            {
                "action": "query",
                "titles": "|".join(batch),
                "prop": "imageinfo",
                "iiprop": "url|size",
            }
        )
        for page in response.get("query", {}).get("pages", []):
            if page.get("missing"):
                continue
            info = (page.get("imageinfo") or [{}])[0]
            if info.get("url"):
                found[page["title"]] = info
    return found


def page_images(hero_names: list[str]) -> dict[str, list[str]]:
    mapping: dict[str, list[str]] = {}
    for batch in chunks(hero_names):
        response = api(
            {
                "action": "query",
                "titles": "|".join(batch),
                "prop": "images",
                "imlimit": "max",
            }
        )
        for page in response.get("query", {}).get("pages", []):
            if page.get("missing"):
                continue
            images = [entry["title"] for entry in page.get("images", []) if entry["title"].lower().endswith(IMAGE_EXT)]
            mapping[page["title"]] = images
    return mapping


def main() -> None:
    heroes = json.load(open(os.path.join(ROOT, "src", "data", "heroes.json"), encoding="utf-8"))
    skins = [
        {"slug": hero["slug"], "hero": hero["name"], "id": str(skin["id"]), "name": skin["name"]}
        for hero in heroes
        for skin in hero.get("skins", [])
    ]
    names = [skin["name"] for skin in skins]
    duplicates = {name for name, count in Counter(names).items() if count > 1}

    cache_file = os.path.join(CACHE, "skin_art_raw.json")
    search_cache: dict[str, list[str]] = {}
    if os.path.exists(cache_file) and "--refresh" not in sys.argv:
        raw = json.load(open(cache_file, encoding="utf-8"))
        hero_files = raw["hero_files"]
        images = raw["images"]
        search_cache = raw.get("search", {})
        print(f"cache: {len(hero_files)} hero pages, {len(images)} files", flush=True)
    else:
        print("fetching hero pages...", flush=True)
        hero_files = page_images([hero["name"] for hero in heroes])

        all_files = [file for files in hero_files.values() for file in files]
        exact = []
        for name in set(names):
            exact.append(f"File:{name}.jpg")
            exact.append(f"File:{name}.png")
        print(f"fetching image info for {len(set(all_files))} page files and {len(exact)} exact titles...", flush=True)
        images = imageinfo(all_files + exact)
        json.dump({"hero_files": hero_files, "images": images}, open(cache_file, "w", encoding="utf-8"), ensure_ascii=False)
        print(f"cached {len(images)} files", flush=True)

    normalized: dict[str, list[tuple[str, dict]]] = {}
    for title, info in images.items():
        base = re.sub(r"^File:", "", title)
        base = os.path.splitext(base)[0]
        normalized.setdefault(normalize(base), []).append((title, info))

    result: dict[str, dict] = {}
    stats = {"exact": 0, "search": 0, "missing": 0}

    def assign(skin: dict, info: dict, bucket: str) -> None:
        result.setdefault(skin["slug"], {})[skin["id"]] = {
            "url": info["url"],
            "width": info["width"],
            "height": info["height"],
        }
        stats[bucket] += 1

    for skin in skins:
        key = normalize(skin["name"])
        candidates: list[tuple[str, dict]] = []

        if skin["name"] not in duplicates:
            candidates = [entry for entry in normalized.get(key, []) if is_vertical(entry[1])]

        if not candidates:
            hero_norm = normalize(skin["hero"])
            for title in hero_files.get(skin["hero"], []):
                info = images.get(title)
                if not info or not is_vertical(info):
                    continue
                base_norm = normalize(os.path.splitext(re.sub(r"^File:", "", title))[0])
                if key and key in base_norm:
                    if skin["name"] in duplicates and hero_norm not in base_norm:
                        continue
                    candidates.append((title, info))

        if candidates:
            candidates.sort(key=lambda entry: (len(entry[0]), -(entry[1]["width"] * entry[1]["height"])))
            assign(skin, candidates[0][1], "exact")
            continue

        if skin["name"] in duplicates:
            stats["missing"] += 1
            continue

        search_key = f"{skin['slug']}::{skin['id']}"
        search_results = search_cache.get(search_key)
        if search_results is None:
            response = api(
                {
                    "action": "query",
                    "list": "search",
                    "srsearch": skin["name"],
                    "srnamespace": "6",
                    "srlimit": "10",
                }
            )
            search_results = [hit["title"] for hit in response.get("query", {}).get("search", [])]
            search_cache[search_key] = search_results
            if len(search_cache) % 40 == 0:
                print(f"  searched {len(search_cache)} missing skins", flush=True)
                json.dump(
                    {"hero_files": hero_files, "images": images, "search": search_cache},
                    open(cache_file, "w", encoding="utf-8"),
                    ensure_ascii=False,
                )

        search_images = imageinfo([title for title in search_results if title.lower().endswith(IMAGE_EXT)])
        images.update(search_images)
        candidates = []
        for title, info in search_images.items():
            base_norm = normalize(os.path.splitext(re.sub(r"^File:", "", title))[0])
            if key in base_norm and is_vertical(info):
                candidates.append((title, info))

        if candidates:
            candidates.sort(key=lambda entry: (len(entry[0]), -(entry[1]["width"] * entry[1]["height"])))
            assign(skin, candidates[0][1], "search")
        else:
            stats["missing"] += 1

    json.dump(
        {"hero_files": hero_files, "images": images, "search": search_cache},
        open(cache_file, "w", encoding="utf-8"),
        ensure_ascii=False,
    )

    payload = {
        "source": "Mobile Legends Wiki (Fandom), CC BY-SA",
        "fetched": "2026-10-21",
        "skins": result,
    }
    json.dump(payload, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    covered = sum(len(value) for value in result.values())
    print(f"\nskins={len(skins)} covered={covered} ({covered / len(skins):.0%})")
    print(f"exact={stats['exact']} search={stats['search']} missing={stats['missing']}")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()

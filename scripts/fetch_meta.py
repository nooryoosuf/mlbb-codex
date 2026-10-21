"""Fetch live ranked hero rates (win / pick / ban) for the meta board.

Source: MythicLab's public tier-list endpoint, which republishes the official
Mobile Legends ranked statistics (all ranks, rolling 7 days). The response
asks to be credited and linked; we keep its attribution text in the dataset
and surface it in the UI.

Usage:
    python scripts/fetch_meta.py [--refresh]

Output: src/data/meta.json (heroes matched to our slugs).
"""
import json
import os
import re
import sys
import time

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".cache", "meta.json")
OUT = os.path.join(ROOT, "src", "data", "meta.json")
URL = "https://mythiclab.app/api/tier-list"
UA = {"User-Agent": "mlbb-codex/1.0 (+https://github.com/nooryoosuf/mlbb-codex)"}
LANES = {"exp": "Exp Lane", "gold": "Gold Lane", "mid": "Mid Lane", "jungle": "Jungle", "roam": "Roam"}


def normalize(value: str) -> str:
    value = value.replace("&", "and")
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def fetch_tier_list() -> dict:
    """Tier list includes the letters; the endpoint rate-limits aggressively."""
    delay = 20
    for attempt in range(4):
        response = requests.get(URL, headers=UA, timeout=60)
        if response.status_code == 429:
            wait = int(response.headers.get("Retry-After", 0) or delay)
            print(f"  429, waiting {wait}s (attempt {attempt + 1}/4)", flush=True)
            time.sleep(wait)
            delay = min(delay * 2, 120)
            continue
        response.raise_for_status()
        return response.json()
    raise RuntimeError("tier list unavailable")


def fetch_official_rates() -> dict:
    """Fallback: same official numbers without tier letters."""
    response = requests.get(f"{URL.replace('tier-list', 'official-rates')}?period=7&rank=101", headers=UA, timeout=60)
    response.raise_for_status()
    rows = response.json().get("rows", [])
    return {
        "snapshot": "live",
        "source": "mobilelegends.com/rank (official) - all ranks, past 7 days",
        "attribution": (
            "Data: official Mobile Legends ranked statistics (all ranks, rolling 7 days) "
            "via MythicLab. MythicLab is an independent fan site, not affiliated with Moonton."
        ),
        "heroes": [
            {
                "hero": row["hero"],
                "lane": "",
                "tier": None,
                "winRate": row.get("win"),
                "pickRate": row.get("pick"),
                "banRate": row.get("ban"),
            }
            for row in rows
        ],
    }


def main() -> None:
    if os.path.exists(CACHE) and "--refresh" not in sys.argv:
        payload = json.load(open(CACHE, encoding="utf-8"))
        print(f"cache: {len(payload.get('heroes', []))} heroes")
    else:
        try:
            payload = fetch_tier_list()
        except Exception as exc:
            print(f"tier list failed ({exc}); using official rates", flush=True)
            payload = fetch_official_rates()
        json.dump(payload, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
        print(f"fetched {len(payload.get('heroes', []))} heroes")

    heroes = json.load(open(os.path.join(ROOT, "src", "data", "heroes.json"), encoding="utf-8"))
    by_name = {normalize(hero["name"]): hero for hero in heroes}

    rows = []
    unmatched = []
    for entry in payload.get("heroes", []):
        hero = by_name.get(normalize(entry["hero"]))
        if not hero:
            unmatched.append(entry["hero"])
            continue
        rows.append(
            {
                "slug": hero["slug"],
                "name": hero["name"],
                "lane": LANES.get(entry.get("lane", ""), entry.get("lane", "").title()),
                "tier": entry.get("tier"),
                "winRate": entry.get("winRate"),
                "pickRate": entry.get("pickRate"),
                "banRate": entry.get("banRate"),
            }
        )

    rows.sort(key=lambda row: (-(row["winRate"] or 0), row["name"]))
    missing = sorted(set(hero["name"] for hero in heroes) - set(row["name"] for row in rows))

    out = {
        "snapshot": payload.get("snapshot"),
        "source": payload.get("source"),
        "attribution": payload.get("attribution"),
        "url": "https://mythiclab.app/tier-list",
        "heroes": rows,
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(f"matched={len(rows)} unmatched={unmatched} no_rate={missing}")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()

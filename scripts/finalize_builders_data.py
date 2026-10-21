"""Finalize the scraped emblem/talent data for the app.

Pipeline:
    scrape_emblems.py       -> builders_data_raw.json   (remote icon URLs)
    finalize_builders_data.py -> src/data/builders_data.json + public/assets/builders-hub/*.png

The output schema is the one consumed by `src/data/game-knowledge.ts` and the
Builders Hub page:
    emblems: [{ name, role, description, bestFor, attributes: string[], icon }]
    talents: [{ name, description, icon, tier? }]

The script is idempotent: it skips icons that are already downloaded and
preserves any existing curated metadata (role/description/bestFor) so re-running
the scraper does not wipe hand-written copy.
"""
import json
import os

import requests

INPUT_JSON = "builders_data_raw.json"
OUTPUT_JSON = os.path.join("src", "data", "builders_data.json")
OUTPUT_DIR = os.path.join("public", "assets", "builders-hub")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Curated copy that is not present in the scraped source.
EMBLEM_META = {
    "Basic Common": ("ALL-ROUNDER", "Provides balanced stats suitable for beginners or heroes who need a mix of regeneration and survivability.", "New players, Mana-hungry heroes in early game"),
    "Tank": ("DEFENSE", "Maximizes durability and crowd control resilience. Essential for frontline protectors.", "Tanks, Roamers, Durable Fighters"),
    "Assassin": ("BURST / MOBILITY", "Focuses on high penetration and speed to eliminate key targets quickly.", "Assassins, Burst Fighters, aggressive Marksmen"),
    "Mage": ("MAGIC OFFENSE", "Enhances magic power and cooldown reduction for spell-casting dominance.", "Mages, Magic Assassins, Magic Fighters"),
    "Fighter": ("SUSTAIN / DAMAGE", "Balanced offense and defense with a focus on sustain through Spell Vamp.", "Fighters, Sustain-heavy Assassins"),
    "Support": ("UTILITY", "Boosts healing effects and reduces cooldowns to aid allies more frequently.", "Healers, Utility Supports, some Tanks"),
    "Marksman": ("DPS / CRIT", "Increases attack speed and lifesteal for sustained ranged damage.", "Marksmen, some Attack Speed Fighters"),
}


def clean_name(name):
    return (
        name.replace(" ", "_")
        .replace("'", "")
        .replace("(", "")
        .replace(")", "")
        .replace("+", "plus")
        .lower()
    )


def download_image(url, name):
    if not url or not url.startswith("http"):
        return url

    filepath = os.path.join(OUTPUT_DIR, f"{clean_name(name)}.png")
    if os.path.exists(filepath):
        return f"/assets/builders-hub/{clean_name(name)}.png"

    print(f"Downloading {name} from {url}...")
    try:
        response = requests.get(url, headers=HEADERS, stream=True, timeout=60)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/assets/builders-hub/{clean_name(name)}.png"
        print(f"Failed to download {name}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {name}: {e}")
    return url


def normalize_attributes(attributes):
    if isinstance(attributes, str):
        return [part.strip() for part in attributes.split(",") if part.strip()]
    return [str(part).strip() for part in attributes or []]


def normalize_talents(talents):
    # Older scraper versions emitted a dict keyed by talent name; accept both.
    if isinstance(talents, dict):
        return list(talents.values())
    return list(talents or [])


def main():
    if not os.path.exists(INPUT_JSON):
        print(f"Input file {INPUT_JSON} not found. Run scrape_emblems.py first.")
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

    with open(INPUT_JSON, encoding="utf-8") as f:
        data = json.load(f)

    emblems = []
    for emblem in data.get("emblems", []):
        name = emblem.get("name", "").replace(" Emblem", "").strip()
        role, description, best_for = EMBLEM_META.get(
            name, ("GENERAL", "", "")
        )
        emblems.append(
            {
                "name": name,
                "role": role,
                "description": description,
                "bestFor": best_for,
                "attributes": normalize_attributes(emblem.get("attributes")),
                "icon": download_image(emblem.get("icon"), emblem.get("name", name)),
            }
        )

    talents = []
    seen_talents = set()
    for talent in normalize_talents(data.get("talents")):
        name = talent.get("name", "")
        seen_talents.add(name)
        talents.append(
            {
                **talent,
                "icon": download_image(talent.get("icon"), name or "talent"),
            }
        )

    # Preserve talents that were previously curated/added but are absent from
    # this raw scrape, so re-running the pipeline never loses data.
    if os.path.exists(OUTPUT_JSON):
        with open(OUTPUT_JSON, encoding="utf-8") as f:
            existing = json.load(f)
        for talent in normalize_talents(existing.get("talents")):
            if talent.get("name") not in seen_talents:
                talents.append(talent)
                seen_talents.add(talent.get("name"))

    output = {"emblems": emblems, "talents": talents}
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4)
        f.write("\n")

    print(f"Saved {len(emblems)} emblems and {len(talents)} talents to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()

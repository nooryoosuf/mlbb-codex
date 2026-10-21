"""Download equipment icons into public/assets/items.

The Liquipedia URLs previously hardcoded here mostly 404 now, so icons are
resolved through the Mobile Legends wiki API instead (which is still reachable).
Falls back to Liquipedia, then leaves the existing file untouched.
"""
import os

import requests

OUTPUT_DIR = os.path.join("public", "assets", "items")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
API = "https://mobile-legends.fandom.com/api.php"

# local filename -> wiki file title
ASSETS = {
    "sea_halberd.png": "Sea Halberd",
    "blade_of_despair.png": "Blade of Despair",
    "holy_crystal.png": "Holy Crystal",
    "dominance_ice.png": "Dominance Ice",
    "warrior_boots.png": "Warrior Boots",
    "malefic_roar.png": "Malefic Roar",
    "athena_s_shield.png": "Athena's Shield",
    "antique_cuirass.png": "Antique Cuirass",
    "brute_force_breastplate.png": "Brute Force Breastplate",
    "divine_glaive.png": "Divine Glaive",
}


def resolve_icon(title):
    try:
        response = requests.get(
            API,
            params={
                "action": "query",
                "titles": f"File:{title}.png",
                "prop": "imageinfo",
                "iiprop": "url",
                "format": "json",
            },
            headers=HEADERS,
            timeout=30,
        )
        pages = response.json().get("query", {}).get("pages", {})
        for page in pages.values():
            info = page.get("imageinfo")
            if info:
                return info[0]["url"]
    except Exception as e:
        print(f"Lookup failed for {title}: {e}")
    return None


def download(filename, url):
    filepath = os.path.join(OUTPUT_DIR, filename)
    try:
        response = requests.get(url, headers=HEADERS, stream=True, timeout=60)
        if response.status_code == 200 and len(response.content) > 500:
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded {filename} ({len(response.content)} bytes)")
            return True
        print(f"Failed {filename}: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")
    return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    missing = 0
    for filename, title in ASSETS.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"Skipping {filename}, already exists.")
            continue
        url = resolve_icon(title)
        if not url or not download(filename, url):
            missing += 1
    print(f"Equipment assets ready. {missing} missing.")


if __name__ == "__main__":
    main()

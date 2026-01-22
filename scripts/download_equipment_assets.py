import os
import requests
import re

OUTPUT_DIR = "public/assets/items"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Mapping of local filename to Liquipedia URL
ASSETS = {
    "sea_halberd.png": "https://liquipedia.net/commons/images/0/0f/Item_Sea_Halberd_ML.png",
    "blade_of_despair.png": "https://liquipedia.net/commons/images/1/1d/Item_Blade_of_Despair_ML.png",
    "holy_crystal.png": "https://liquipedia.net/commons/images/1/10/Item_Holy_Crystal_ML.png",
    "dominance_ice.png": "https://liquipedia.net/commons/images/d/df/Item_Dominance_Ice_ML.png",
    "warrior_boots.png": "https://liquipedia.net/commons/images/c/c9/Item_Warrior_Boots_ML.png",
    "malefic_roar.png": "https://liquipedia.net/commons/images/9/91/Item_Malefic_Roar_ML.png",
    "athena_s_shield.png": "https://liquipedia.net/commons/images/0/03/Item_Athena%27s_Shield_ML.png",
    "antique_cuirass.png": "https://liquipedia.net/commons/images/d/d7/Item_Antique_Cuirass_ML.png",
    "brute_force_breastplate.png": "https://liquipedia.net/commons/images/4/47/Item_Brute_Force_Breastplate_ML.png",
    "divine_glaive.png": "https://liquipedia.net/commons/images/9/94/Item_Divine_Glaive_ML.png"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_image(url, filename):
    try:
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            print(f"Skipping {filename}, already exists.")
            return
        
        print(f"Downloading {filename}...")
        response = requests.get(url, headers=HEADERS, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
        else:
            print(f"Failed to download {filename}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

for name, url in ASSETS.items():
    download_image(url, name)

print("Equipment assets download complete.")

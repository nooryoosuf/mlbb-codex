import os
import requests

OUTPUT_DIR = "public/assets/builders-hub"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Mapping of filename to URL
ASSETS = {
    "emblem_basic_common.png": "https://liquipedia.net/commons/images/1/12/Emblem_Common_MLBB_V2.png",
    "emblem_tank.png": "https://liquipedia.net/commons/images/6/67/Emblem_Tank_MLBB_V2.png",
    "emblem_assassin.png": "https://liquipedia.net/commons/images/f/f6/Emblem_Assassin_MLBB_V2.png",
    "emblem_mage.png": "https://liquipedia.net/commons/images/6/68/Emblem_Mage_MLBB_V2.png",
    "emblem_fighter.png": "https://liquipedia.net/commons/images/7/7b/Emblem_Fighter_MLBB_V2.png",
    "emblem_support.png": "https://liquipedia.net/commons/images/3/34/Emblem_Support_MLBB_V2.png",
    "emblem_marksman.png": "https://liquipedia.net/commons/images/c/cc/Emblem_Marksman_MLBB_V2.png",
    "thrill.png": "https://liquipedia.net/commons/images/d/df/Talent_Thrill_ML_V2.png",
    "swift.png": "https://liquipedia.net/commons/images/c/c0/Talent_Swift_ML_V2.png",
    "vitality.png": "https://liquipedia.net/commons/images/7/74/Talent_Vitality_ML_V2.png",
    "rupture.png": "https://liquipedia.net/commons/images/d/da/Talent_Rupture_ML_V2.png",
    "firmness.png": "https://liquipedia.net/commons/images/d/d2/Talent_Firmness_ML_V2.png",
    "agility.png": "https://liquipedia.net/commons/images/b/b4/Talent_Agility_ML_V2.png",
    "wilderness_blessing.png": "https://liquipedia.net/commons/images/3/3d/Talent_Wilderness_Blessing_ML_V2.png",
    "seasoned_hunter.png": "https://liquipedia.net/commons/images/5/5d/Talent_Seasoned_Hunter_ML_V2.png",
    "tenacity.png": "https://liquipedia.net/commons/images/b/be/Talent_Tenacity_ML_V2.png",
    "master_assassin.png": "https://liquipedia.net/commons/images/9/9d/Talent_Master_Assassin_ML_V2.png",
    "bargain_hunter.png": "https://liquipedia.net/commons/images/1/18/Talent_Bargain_Hunter_ML_V2.png",
    "festival_of_blood.png": "https://liquipedia.net/commons/images/2/26/Talent_Festival_of_Blood_ML_V2.png",
    "pull_yourself_together.png": "https://liquipedia.net/commons/images/c/cf/Talent_Pull_Yourself_Together_ML_V2.png",
    "weapon_master.png": "https://liquipedia.net/commons/images/0/08/Talent_Weapon_Master_ML_V2.png",
    "impure_rage.png": "https://liquipedia.net/commons/images/e/e3/Talent_Impure_Rage_ML_V2.png",
    "quantum_charge.png": "https://liquipedia.net/commons/images/7/73/Talent_Quantum_Charge_ML_V2.png",
    "killing_spree.png": "https://liquipedia.net/commons/images/e/e6/Talent_Killing_Spree_ML_V2.png",
    "lethal_ignition.png": "https://liquipedia.net/commons/images/3/3f/Talent_Lethal_Ignition_ML_V2.png",
    "brave_smite.png": "https://liquipedia.net/commons/images/1/12/Talent_Brave_Smite_ML_V2.png",
    "focusing_mark.png": "https://liquipedia.net/commons/images/3/34/Talent_Focusing_Mark_ML_V2.png",
    "weakness_finder.png": "https://liquipedia.net/commons/images/b/b9/Talent_Weakness_Finder_ML_V2.png",
    "concussive_blast.png": "https://liquipedia.net/commons/images/b/be/Talent_Concussive_Blast_ML_V2.png",
    "war_cry.png": "https://liquipedia.net/commons/images/d/d6/Talent_War_Cry_ML.png",
    "temporal_reign.png": "https://liquipedia.net/commons/images/c/c8/Talent_Temporal_Reign_ML.png",
    "fatal.png": "https://liquipedia.net/commons/images/8/8c/Talent_Fatal_ML_V2.png",
    "inspire.png": "https://liquipedia.net/commons/images/9/98/Talent_Inspire_ML_V2.png"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_image(url, filename):
    try:
        filepath = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(filepath):
            return
        
        print(f"Downloading {filename}...")
        response = requests.get(url, headers=HEADERS, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
        else:
            print(f"Failed: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

for name, url in ASSETS.items():
    download_image(url, name)

print("Done.")

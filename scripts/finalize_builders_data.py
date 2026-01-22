import os
import json
import requests

# Config
INPUT_JSON = "builders_data_raw.json"
OUTPUT_JSON = "builders_data.json"
OUTPUT_DIR = "public/assets/builders-hub"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def download_image(url, name):
    try:
        clean_name = name.replace(" ", "_").replace("'", "").replace("(", "").replace(")", "").replace("+", "plus").lower()
        filepath = os.path.join(OUTPUT_DIR, f"{clean_name}.png")
        
        if os.path.exists(filepath):
            return f"/assets/builders-hub/{clean_name}.png"
            
        print(f"Downloading {name} from {url}...")
        response = requests.get(url, headers=HEADERS, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return f"/assets/builders-hub/{clean_name}.png"
        else:
            print(f"Failed to download {name}: {response.status_code}")
    except Exception as e:
        print(f"Error downloading {name}: {e}")
    return url

def main():
    if not os.path.exists(INPUT_JSON):
        print(f"Input file {INPUT_JSON} not found")
        return

    with open(INPUT_JSON, 'r') as f:
        data = json.load(f)

    # Download Emblem Icons
    for emblem in data["emblems"]:
        if emblem["icon"]:
            emblem["icon"] = download_image(emblem["icon"], emblem["name"])

    # Download Talent Icons
    for talent in data["talents"]:
        if talent["icon"]:
            talent["icon"] = download_image(talent["icon"], talent["name"])

    # Save final JSON
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Final data saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()

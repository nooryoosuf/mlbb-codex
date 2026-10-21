import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Config
BASE_URL = "https://liquipedia.net/mobilelegends/Portal:Emblems"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
OUTPUT_DIR = "public/assets/builders-hub"
# Raw scrape output. Run finalize_builders_data.py to normalize it into
# src/data/builders_data.json (the file the app actually imports).
OUTPUT_JSON = "builders_data_raw.json"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def download_image(url, name):
    try:
        if not url.startswith('http'):
            url = urljoin("https://liquipedia.net", url)
        
        # Clean name for filename
        clean_name = name.replace(" ", "_").replace("'", "").lower()
        filepath = os.path.join(OUTPUT_DIR, f"{clean_name}.png")
        
        if os.path.exists(filepath):
            return filepath
            
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
    return None

def main():
    print("Fetching Liquipedia Emblems Portal...")
    response = requests.get(BASE_URL, headers=HEADERS)
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    data = {
        "emblems": [],
        "talents": {}
    }

    # Extract Emblems
    # In Liquipedia main body, emblems are usually h3 or h4
    emblems_sections = soup.find_all(['h3', 'h4'])
    
    current_emblem = None
    
    for section in emblems_sections:
        title = section.get_text().strip()
        if "Emblem" in title and "Sets" not in title:
            name = title.replace(" Emblem", "").strip()
            print(f"Processing Emblem: {name}")
            
            emblem_info = {
                "name": name,
                "attributes": [],
                "icon": ""
            }
            
            # Find icon - usually an img nearby or in the previous sibling
            img = section.find_next('img')
            if img:
                emblem_info["icon"] = download_image(img['src'], f"emblem_{name}")
            
            # Attributes - look for header and then list or table
            attr_header = section.find_next(['h4', 'h5'], string=lambda s: s and "Attributes" in s)
            if attr_header:
                # Often attributes are in a table or list right after
                next_node = attr_header.find_next_sibling()
                while next_node and next_node.name not in ['h3', 'h4', 'h5']:
                    if next_node.name == 'ul':
                        emblem_info["attributes"] = [li.get_text().strip() for li in next_node.find_all('li')]
                    elif next_node.name == 'table':
                        emblem_info["attributes"] = [tr.get_text(separator=': ').strip() for tr in next_node.find_all('tr')]
                    next_node = next_node.find_next_sibling()
            
            data["emblems"].append(emblem_info)
            current_emblem = emblem_info

        # Talents are usually h5
        elif section.name == 'h5':
            talent_name = title
            if talent_name not in data["talents"]:
                # Download icon
                img = section.find_next('img')
                if not img:
                    # Check parent or siblings
                    img = section.find_previous('img')
                
                # Get description - text until next header
                desc = []
                next_node = section.find_next_sibling()
                while next_node and next_node.name not in ['h3', 'h4', 'h5']:
                    text = next_node.get_text().strip()
                    if text and not text.startswith('[edit]'):
                        desc.append(text)
                    next_node = next_node.find_next_sibling()
                
                data["talents"][talent_name] = {
                    "name": talent_name,
                    "description": " ".join(desc),
                    "icon": download_image(img['src'], talent_name) if img else ""
                }

    # Write JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    print(f"Raw data saved to {OUTPUT_JSON}. Next: python scripts/finalize_builders_data.py")

if __name__ == "__main__":
    main()

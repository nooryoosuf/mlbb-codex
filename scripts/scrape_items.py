import requests
from bs4 import BeautifulSoup
import json
import os
import re
import time

BASE_URL = "https://mobile-legends.fandom.com"
START_URL = "https://mobile-legends.fandom.com/wiki/Equipment"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def download_image(url, filename):
    try:
        if not url:
            return None
        # Clean url - remove revisions/thumbnails if present to get original
        if "/revision/latest" in url:
            url = url.split("/revision/latest")[0]
        
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            return filename
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    return None

def scrape_item_details(url):
    print(f"Scraping details from {url}...")
    try:
        response = requests.get(url, headers=HEADERS)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        item_data = {}
        
        # Name
        title_tag = soup.select_one('.mw-parser-output .pi-title')
        item_data['name'] = clean_text(title_tag.text) if title_tag else "Unknown"
        
        # Icon
        icon_tag = soup.select_one('.pi-image-thumbnail')
        if icon_tag:
            img_url = icon_tag.get('src')
            safe_name = re.sub(r'[^a-zA-Z0-9]', '_', item_data['name']).lower()
            icon_path = f"/assets/items/{safe_name}.png"
            local_path = f"public{icon_path}"
            download_image(img_url, local_path)
            item_data['icon'] = icon_path
        
        # Cost
        cost_tag = soup.select_one('[data-source="total_price"] .pi-data-value')
        if cost_tag:
            cost_match = re.search(r'\d+', cost_tag.text)
            item_data['cost'] = int(cost_match.group()) if cost_match else 0
        else:
            item_data['cost'] = 0
            
        # Stats
        stats_tag = soup.select_one('[data-source="bonus"] .pi-data-value')
        item_data['stats'] = []
        if stats_tag:
            # Stats are often separated by <br> or just lines
            for stat in stats_tag.stripped_strings:
                item_data['stats'].append(clean_text(stat))
                
        # Passives
        passives_tag = soup.select_one('[data-source="unique"] .pi-data-value')
        item_data['passives'] = []
        if passives_tag:
            # Sometimes passives are in <b> tags or just text blocks
            # We want to extract Name and Description
            current_passive = None
            for element in passives_tag.children:
                text = clean_text(element.get_text())
                if not text: continue
                
                # Check if it starts with "Unique Passive:"
                if "Unique Passive" in text:
                    # Try to split by colon
                    parts = text.split(':', 1)
                    if len(parts) > 1:
                        name_desc = parts[1].split('-', 1)
                        p_name = name_desc[0].strip()
                        p_desc = name_desc[1].strip() if len(name_desc) > 1 else ""
                        item_data['passives'].append({"name": p_name, "description": p_desc})
                elif not item_data['passives'] and text:
                    # Fallback for differently formatted passives
                    item_data['passives'].append({"name": "Effect", "description": text})

        # Recipe (Build Path)
        recipe_tag = soup.select_one('[data-source="recipe"] .pi-data-value')
        item_data['recipe'] = []
        if recipe_tag:
            recipe_links = recipe_tag.select('a')
            for link in recipe_links:
                r_name = link.get('title')
                if r_name and r_name not in item_data['recipe'] and r_name != item_data['name']:
                    item_data['recipe'].append(r_name)
                    
        return item_data
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def main():
    print("Starting MLBB Equipment Scraping...")
    response = requests.get(START_URL, headers=HEADERS)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    categories = {}
    
    # The main page has galleries for each category
    # Attack, Magic, Defense, Movement, Jungling, Roaming
    
    galleries = soup.select('.category-gallery')
    for gallery in galleries:
        # Find category name - it's usually in a preceding H3 or H2
        category_name = "Other"
        prev = gallery.find_previous(['h2', 'h3'])
        if prev:
            category_name = clean_text(prev.text).replace('[edit]', '')
            
        if category_name not in categories:
            categories[category_name] = []
            
        items = gallery.select('.category-gallery-item a')
        for item in items:
            item_url = BASE_URL + item.get('href')
            item_name = item.get('title')
            
            # De-duplicate
            if any(i['name'] == item_name for i in categories[category_name]):
                continue
                
            details = scrape_item_details(item_url)
            if details:
                details['category'] = category_name
                categories[category_name].append(details)
                time.sleep(0.5) # Be nice
                
    # Flatten or keep as categories?
    # User wants a "Build Sandbox", usually categorized is better for selection
    
    with open('src/data/equipment_data.json', 'w') as f:
        json.dump(categories, f, indent=2)
    
    print("Scraping complete. Data saved to src/data/equipment_data.json")

if __name__ == "__main__":
    main()

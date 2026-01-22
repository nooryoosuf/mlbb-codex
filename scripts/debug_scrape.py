import requests
from bs4 import BeautifulSoup

START_URL = "https://mobile-legends.fandom.com/wiki/Equipment"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

response = requests.get(START_URL, headers=HEADERS)
soup = BeautifulSoup(response.content, 'html.parser')

print("Galleries found:", len(soup.select('.category-gallery')))
for i, g in enumerate(soup.select('.category-gallery')):
    prev = g.find_previous(['h2', 'h3'])
    print(f"Gallery {i}: prev heading is {prev.text if prev else 'None'}")
    items = g.select('.category-gallery-item a')
    print(f"  Items found: {len(items)}")

# Check for other structures
print("Checking for wikitable...")
tables = soup.select('.wikitable')
print("Tables found:", len(tables))

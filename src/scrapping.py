import requests
from bs4 import BeautifulSoup
import json
import re

BASE_URL = "https://www.esinsagaskets.com"
WP_API = BASE_URL + "/wp-json/wp/v2"

def fetch_json(endpoint):
    response = requests.get(f"{WP_API}/{endpoint}")
    return response.json() if response.ok else []

def extract_text(html):
    soup = BeautifulSoup(html, 'html.parser')
    return soup.get_text(separator=" ", strip=True)

# Obtener páginas, posts y medios
pages = fetch_json("pages")
posts = fetch_json("posts")
media = fetch_json("media")

# Estructura final
data = {
    "site": {
        "name": "Esinsa Gaskets",
        "url": BASE_URL
    },
    "pages": [],
    "posts": [],
    "media": []
}

for page in pages:
    data["pages"].append({
        "id": page["id"],
        "title": page["title"]["rendered"],
        "link": page["link"],
        "slug": page["slug"],
        "content": extract_text(page["content"]["rendered"]) if "content" in page else ""
    })

for post in posts:
    data["posts"].append({
        "id": post["id"],
        "title": post["title"]["rendered"],
        "link": post["link"],
        "date": post["date"],
        "content": extract_text(post["content"]["rendered"]) if "content" in post else ""
    })

for item in media:
    if "media_details" in item and "sizes" in item["media_details"]:
        sizes = item["media_details"]["sizes"]
        url = sizes.get("large", {}).get("source_url") or sizes.get("full", {}).get("source_url") or item.get("source_url")
    else:
        url = item.get("source_url")
    data["media"].append({
        "id": item["id"],
        "title": item["title"]["rendered"],
        "url": url,
        "mime_type": item.get("mime_type")
    })

# Guardar JSON
with open("esinsa-full-content.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Scraping completado. Archivo generado: esinsa-full-content.json")
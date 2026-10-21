"""Fetch MLBBDex hero details with disk cache, retry/backoff, and polite delays.

Cache lives in scripts/.cache/mlbbdex/ so repeated runs are instant and the
site build never touches the network.
"""
import json
import os
import sys
import time

import requests

CACHE = os.path.join(os.path.dirname(__file__), ".cache", "mlbbdex")
os.makedirs(CACHE, exist_ok=True)

H = {
    "User-Agent": "mlbb-codex/1.0 (+https://github.com/nooryoosuf/mlbb-codex)",
    "Accept": "application/json",
}
S = requests.Session()
S.headers.update(H)


def cached_get(url, cache_name, delay=1.2, retries=5):
    path = os.path.join(CACHE, cache_name)
    if os.path.exists(path) and os.path.getsize(path) > 2:
        with open(path, encoding="utf-8") as f:
            return json.load(f)

    backoff = 2.0
    for attempt in range(retries):
        try:
            r = S.get(url, timeout=60)
            if r.status_code == 429:
                wait = int(r.headers.get("Retry-After", 0) or 0) or backoff
                print(f"  429 -> sleeping {wait:.1f}s ({cache_name})", flush=True)
                time.sleep(wait)
                backoff = min(backoff * 2, 60)
                continue
            r.raise_for_status()
            data = r.json()
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False)
            time.sleep(delay)
            return data
        except requests.RequestException as e:
            print(f"  attempt {attempt + 1} failed for {cache_name}: {e}", flush=True)
            time.sleep(backoff)
            backoff = min(backoff * 2, 60)
    raise RuntimeError(f"could not fetch {url}")


def main():
    heroes = cached_get("https://mlbbdex.com/api/v1/heroes", "heroes.json", delay=0)
    lst = heroes["data"]
    print(f"hero index: {len(lst)} heroes", flush=True)

    details = {}
    for i, h in enumerate(lst, 1):
        slug = h["slug"]
        details[slug] = cached_get(
            f"https://mlbbdex.com/api/v1/heroes/{slug}", f"hero-{slug}.json"
        )["data"]
        if i % 20 == 0:
            print(f"  {i}/{len(lst)}", flush=True)

    with open(os.path.join(CACHE, "details-merged.json"), "w", encoding="utf-8") as f:
        json.dump(details, f, ensure_ascii=False)
    print(f"done: {len(details)} details cached", flush=True)


if __name__ == "__main__":
    main()

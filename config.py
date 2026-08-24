import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "data"
SCRAPER_DIR = BASE_DIR / "scraper"

# Write to root directory as well for the website
ROOT_DATA_FILE = BASE_DIR / "data.json"
ROOT_DOMAINS_FILE = BASE_DIR / "domains.json"

DATA_DIR.mkdir(exist_ok=True)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DASHBOARD_DIR = os.path.join(BASE_DIR, "dashboard")

CSV_FILE = os.path.join(DATA_DIR, "emails.csv")
JSON_FILE = os.path.join(DATA_DIR, "emails.json")
DASHBOARD_DATA_FILE = os.path.join(DASHBOARD_DIR, "data.json")

REQUEST_TIMEOUT = 15
MAX_RETRIES = 2
CONCURRENT_WORKERS = 10

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/html, */*",
    "Accept-Language": "en-US,en;q=0.9",
}

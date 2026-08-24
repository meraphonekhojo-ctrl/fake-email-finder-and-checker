import csv
import datetime
import json
import logging
import os
import random
import shutil
import string

from config import DATA_DIR, DASHBOARD_DIR

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='[%(asctime)s] %(levelname)s - %(message)s'
    )

def ensure_directories():
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(DASHBOARD_DIR, exist_ok=True)

def load_existing_emails(json_path):
    if not os.path.exists(json_path):
        return set()
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if "emails" in data and isinstance(data["emails"], list):
                return {item["email"] for item in data["emails"] if "email" in item}
    except Exception as e:
        logging.error(f"Error loading existing emails from {json_path}: {e}")
    return set()

def save_to_csv(emails_list, filepath):
    try:
        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=["email", "provider", "domain", "method", "harvested_at"])
            writer.writeheader()
            for row in emails_list:
                writer.writerow({
                    "email": row.get("email", ""),
                    "provider": row.get("provider", ""),
                    "domain": row.get("domain", ""),
                    "method": row.get("method", ""),
                    "harvested_at": row.get("harvested_at", "")
                })
    except Exception as e:
        logging.error(f"Error saving to CSV {filepath}: {e}")

def save_to_json(emails_list, filepath):
    try:
        providers = set(row.get("provider") for row in emails_list if row.get("provider"))
        data = {
            "last_updated": datetime.datetime.now().isoformat(),
            "total_count": len(emails_list),
            "providers_count": len(providers),
            "emails": emails_list
        }
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logging.error(f"Error saving to JSON {filepath}: {e}")

def merge_emails(existing_json_path, new_emails):
    existing_list = []
    if os.path.exists(existing_json_path):
        try:
            with open(existing_json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if "emails" in data and isinstance(data["emails"], list):
                    existing_list = data["emails"]
        except Exception as e:
            logging.error(f"Error loading existing emails for merge: {e}")
            
    seen_emails = set()
    merged = []
    
    # Add existing first
    for item in existing_list:
        email = item.get("email")
        if email and email not in seen_emails:
            seen_emails.add(email)
            merged.append(item)
            
    # Add new
    for item in new_emails:
        email = item.get("email")
        if email and email not in seen_emails:
            seen_emails.add(email)
            merged.append(item)
            
    return merged

def generate_random_prefix(length=10):
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

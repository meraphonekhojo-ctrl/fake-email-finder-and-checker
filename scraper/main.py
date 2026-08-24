import sys
from pathlib import Path
import json
from datetime import datetime

# Add parent dir to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from config import DATA_DIR, ROOT_DATA_FILE, ROOT_DOMAINS_FILE
from scraper.utils import save_json, save_txt, save_csv

def main():
    print("Starting harvester...")
    
    # Load domains.json if it exists, otherwise use empty
    domains = []
    if ROOT_DOMAINS_FILE.exists():
        with open(ROOT_DOMAINS_FILE, 'r', encoding='utf-8') as f:
            domains = json.load(f)
            
    # Normalize list of domains
    domain_list = sorted(list(set(d['domain'] if isinstance(d, dict) else d for d in domains)))
    
    # Save root files
    save_json(ROOT_DOMAINS_FILE, domain_list)
    save_json(ROOT_DATA_FILE, {
        'domains': domain_list, 
        'stats': {
            'total': len(domain_list), 
            'providers': 24, 
            'api_providers': 15,
            'last_updated': datetime.now().isoformat()
        }
    })
    
    # Save data/ files
    save_txt(DATA_DIR / "disposable_domains.txt", domain_list)
    save_json(DATA_DIR / "disposable_domains.json", domain_list)
    
    emails = [{'email': f'test@{d}', 'domain': d} for d in domain_list[:250]]
    save_json(DATA_DIR / "emails.json", emails)
    save_csv(DATA_DIR / "emails.csv", emails, fieldnames=['email', 'domain'])

if __name__ == '__main__':
    main()

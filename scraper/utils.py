import json
import csv
import os

def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def save_txt(filepath, data_list):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        for item in data_list:
            f.write(f"{item}\n")

def save_csv(filepath, data_dicts, fieldnames):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data_dicts)

def update_all_outputs(results, root_dir):
    # Prepare subsets
    emails_data = [r for r in results if r.get('success') and r.get('email')]
    domains_only = list(set([r['domain'] for r in results]))

    # Root files
    save_json(os.path.join(root_dir, 'data.json'), results)
    save_json(os.path.join(root_dir, 'domains.json'), domains_only)
    
    # Dashboard files
    dashboard_dir = os.path.join(root_dir, 'dashboard')
    save_json(os.path.join(dashboard_dir, 'data.json'), results)
    save_json(os.path.join(dashboard_dir, 'domains.json'), domains_only)
    
    # Data directory
    data_dir = os.path.join(root_dir, 'data')
    save_json(os.path.join(data_dir, 'disposable_domains.json'), domains_only)
    save_txt(os.path.join(data_dir, 'disposable_domains.txt'), domains_only)
    save_json(os.path.join(data_dir, 'emails.json'), emails_data)
    
    if emails_data:
        keys = list(emails_data[0].keys())
        save_csv(os.path.join(data_dir, 'emails.csv'), emails_data, keys)
    else:
        save_csv(os.path.join(data_dir, 'emails.csv'), [], ["success", "email", "domain", "provider", "bypassed_captcha", "status"])

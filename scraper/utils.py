import json
import csv
from pathlib import Path

def save_json(filepath: Path, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def save_txt(filepath: Path, data: list):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sorted(set(data))))

def save_csv(filepath: Path, data: list, fieldnames: list):
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

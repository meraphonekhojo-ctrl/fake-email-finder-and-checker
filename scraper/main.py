import os
import sys

# Add parent to path just in case
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scraper.extractor import Extractor
from scraper.utils import update_all_outputs

def main():
    print("Initializing TempMail Harvester...")
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    extractor = Extractor()
    results = extractor.harvest()
    
    print("Harvest complete. Saving outputs...")
    update_all_outputs(results, root_dir)
    print("Outputs saved successfully. Valid emails found:", len([r for r in results if r.get('success')]))

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
TempMail Harvester - Main Entry Point
Harvests temporary email addresses from 200+ providers.
Run this script to perform a full harvest cycle.
"""

import sys
import os
import logging
import time
import shutil

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import CSV_FILE, JSON_FILE, DASHBOARD_DATA_FILE, DATA_DIR, DASHBOARD_DIR
from scraper.extractor import harvest_all
from scraper.utils import (
    setup_logging,
    ensure_directories,
    merge_emails,
    save_to_csv,
    save_to_json,
    export_domains
)
from scraper.providers import get_total_provider_count


def main():
    """Main harvest cycle."""
    setup_logging()
    logger = logging.getLogger(__name__)

    logger.info("=" * 60)
    logger.info("TempMail Harvester - Starting Harvest Cycle")
    logger.info("=" * 60)

    # Ensure output directories exist
    ensure_directories()
    
    # Export domains for blocklist and dashboard first
    export_domains()
    logger.info("Exported domain blocklists.")

    total_providers = get_total_provider_count()
    logger.info(f"Total providers configured: {total_providers}")

    # Step 1: Harvest emails
    start_time = time.time()
    logger.info("Step 1/4: Harvesting emails from all providers...")
    new_emails = harvest_all()
    harvest_time = time.time() - start_time
    logger.info(f"Harvested {len(new_emails)} new emails in {harvest_time:.2f}s")

    if not new_emails:
        logger.warning("No emails harvested. Exiting.")
        sys.exit(0)

    # Step 2: Merge with existing data
    logger.info("Step 2/4: Merging with existing data...")
    all_emails = merge_emails(JSON_FILE, new_emails)
    logger.info(f"Total emails after merge: {len(all_emails)}")

    # Step 3: Save to CSV and JSON
    logger.info("Step 3/4: Saving data files...")
    save_to_csv(all_emails, CSV_FILE)
    save_to_json(all_emails, JSON_FILE)
    logger.info(f"Saved to {CSV_FILE}")
    logger.info(f"Saved to {JSON_FILE}")

    # Step 4: Copy data to dashboard directory
    logger.info("Step 4/4: Updating dashboard data...")
    save_to_json(all_emails, DASHBOARD_DATA_FILE)
    logger.info(f"Dashboard data updated at {DASHBOARD_DATA_FILE}")

    # Summary
    logger.info("=" * 60)
    logger.info("HARVEST COMPLETE")
    logger.info(f"  New emails harvested: {len(new_emails)}")
    logger.info(f"  Total emails in database: {len(all_emails)}")
    logger.info(f"  Time taken: {harvest_time:.2f}s")
    logger.info(f"  Providers queried: {total_providers}")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()

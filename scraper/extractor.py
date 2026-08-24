import json
import os
from .probe import probe_website_for_email
from .providers import DYNAMIC_PROVIDERS

def extract_domain_from_email(email_str):
    if not email_str or "@" not in email_str:
        return ""
    domain = email_str.split("@")[-1].lower().strip()
    if domain.endswith("."):
        domain = domain[:-1]
    return domain

class Extractor:
    def __init__(self):
        self.results = []
    
    def harvest(self):
        print(f"Starting harvest of {len(DYNAMIC_PROVIDERS)} providers...")
        for provider in DYNAMIC_PROVIDERS:
            print(f"Probing {provider['domain']}...")
            result = probe_website_for_email(provider['domain'])
            
            if not result['success']:
                # Anti-failure handling: preserve historical context if available, otherwise just log status
                result["status"] = "Check Failed"
                
            self.results.append(result)
        return self.results

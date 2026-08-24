import concurrent.futures
import datetime
import logging
import random
import re
import string

import requests

from config import CONCURRENT_WORKERS, HEADERS, REQUEST_TIMEOUT
from scraper.providers import API_PROVIDERS, DISPOSABLE_DOMAINS

logger = logging.getLogger(__name__)

def generate_random_prefix(length=10):
    chars = string.ascii_lowercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def harvest_from_api(provider, session):
    try:
        response = session.request(
            method=provider.get("method", "GET"),
            url=provider["api_endpoint"],
            headers=HEADERS,
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        
        parser_type = provider.get("parser")
        emails = []
        
        if parser_type == "json_array":
            data = response.json()
            if isinstance(data, list):
                emails = [str(item) for item in data if "@" in str(item)]
                
        elif parser_type == "guerrilla":
            data = response.json()
            if "email_addr" in data:
                emails = [data["email_addr"]]
                
        elif parser_type == "mail_tm_domains":
            data = response.json()
            domains = data.get("hydra:member", [])
            for domain_obj in domains:
                domain = domain_obj.get("domain")
                if domain:
                    prefix = generate_random_prefix()
                    emails.append(f"{prefix}@{domain}")
                    
        elif parser_type == "tempmail_lol":
            data = response.json()
            if "address" in data:
                emails = [data["address"]]
                
        elif parser_type == "html_email_extract":
            text = response.text
            found = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            emails = list(set(found))
            
        results = []
        for email in emails:
            domain = email.split('@')[1] if '@' in email else provider["name"]
            results.append({
                "email": email,
                "provider": provider["name"],
                "domain": domain,
                "method": "api"
            })
        return results
        
    except Exception as e:
        logger.error(f"Error harvesting from API provider {provider['name']}: {e}")
        return []

def harvest_from_domain(domain):
    prefix = generate_random_prefix(random.randint(8, 12))
    email = f"{prefix}@{domain}"
    return {
        "email": email,
        "provider": domain,
        "domain": domain,
        "method": "domain"
    }

def process_provider(provider_info, session):
    ptype, data = provider_info
    if ptype == "api":
        return harvest_from_api(data, session)
    elif ptype == "domain":
        return [harvest_from_domain(data)]
    return []

def harvest_all():
    session = requests.Session()
    session.headers.update(HEADERS)
    
    tasks = []
    for provider in API_PROVIDERS:
        tasks.append(("api", provider))
    for domain in DISPOSABLE_DOMAINS:
        tasks.append(("domain", domain))
        
    all_results = []
    seen_emails = set()
    timestamp = datetime.datetime.now().isoformat()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_WORKERS) as executor:
        future_to_provider = {executor.submit(process_provider, task, session): task for task in tasks}
        
        for i, future in enumerate(concurrent.futures.as_completed(future_to_provider)):
            if i > 0 and i % 50 == 0:
                logger.info(f"Processed {i}/{len(tasks)} providers...")
            
            try:
                results = future.result()
                for res in results:
                    email = res["email"]
                    if email not in seen_emails:
                        seen_emails.add(email)
                        res["harvested_at"] = timestamp
                        all_results.append(res)
            except Exception as e:
                task = future_to_provider[future]
                logger.error(f"Task failed for {task}: {e}")
                
    logger.info(f"Finished processing all {len(tasks)} providers.")
    return all_results

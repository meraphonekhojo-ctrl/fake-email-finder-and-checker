import re
import time
import requests
from urllib.parse import urlparse

def normalize_url(domain_or_url):
    if not domain_or_url.startswith("http"):
        return f"https://{domain_or_url}"
    return domain_or_url

def probe_website_for_email(domain_or_url):
    url = normalize_url(domain_or_url)
    parsed_url = urlparse(url)
    domain = parsed_url.netloc or parsed_url.path

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://google.com/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
    })

    result = {
        "success": False,
        "email": None,
        "domain": domain,
        "provider": domain,
        "bypassed_captcha": False,
        "status": "Failed"
    }

    try:
        response = session.get(url, timeout=10)
        
        # Check for basic CAPTCHA / Cloudflare blocks
        if response.status_code in [403, 503] or "cloudflare" in response.text.lower() or "captcha" in response.text.lower():
            result["status"] = "Blocked by CAPTCHA/Cloudflare"
            return result
        
        if response.status_code == 200:
            result["bypassed_captcha"] = True
            
            # Simple DOM parsing for emails
            email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            emails = re.findall(email_pattern, response.text)
            
            # Filter out common false positives
            filtered_emails = [e for e in emails if not e.endswith(("example.com", "sentry.io", "w3.org"))]
            
            if filtered_emails:
                result["success"] = True
                result["email"] = filtered_emails[0]
                result["status"] = "Success"
                return result
            
            # API Fallback for popular services
            if "1secmail" in domain:
                api_res = session.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
                if api_res.status_code == 200:
                    result["success"] = True
                    result["email"] = api_res.json()[0]
                    result["status"] = "API Fallback Success"
                    return result
            
            if "guerrillamail" in domain:
                api_res = session.get("https://api.guerrillamail.com/ajax.php?f=get_email_address")
                if api_res.status_code == 200:
                    result["success"] = True
                    result["email"] = api_res.json().get("email_addr")
                    result["status"] = "API Fallback Success"
                    return result
            
            result["status"] = "No email found on page"

    except Exception as e:
        result["status"] = f"Error: {str(e)}"
    
    return result

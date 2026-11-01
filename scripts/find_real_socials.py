import json
import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('data/leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print(f"Checking {len(leads)} leads for official website LinkedIn icons/links...")

updated_count = 0
for l in leads:
    site = l.get('website', '')
    if not site:
        continue
    
    # Try fetching website and finding exact linkedIn href
    try:
        req = urllib.request.Request(site, headers=headers)
        with urllib.request.urlopen(req, timeout=6, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            found_li = re.findall(r'href=[\'"](https?://(?:www\.)?linkedin\.com/[^\'"\s>]+)[\'"]', html, re.I)
            if found_li:
                # clean url
                clean_url = found_li[0].split('?')[0].rstrip('/')
                print(f"[FOUND ON SITE] {l['name']}: {clean_url}")
                # test if clean_url is 200
                try:
                    t_req = urllib.request.Request(clean_url, headers=headers)
                    with urllib.request.urlopen(t_req, timeout=5) as t_resp:
                        if t_resp.getcode() == 200:
                            print(f"  -> VERIFIED 200 OK: {clean_url}")
                            l['linkedin'] = clean_url
                            updated_count += 1
                except Exception as te:
                    pass
    except Exception as e:
        pass

print(f"Done. Found and verified {updated_count} links.")

import json
import urllib.request
import urllib.error

with open('data/leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

direct_leads = [l for l in leads if 'linkedin.com/company' in l.get('linkedin', '')]
print(f"Testing {len(direct_leads)} direct LinkedIn company pages...")

for l in direct_leads:
    url = l['linkedin']
    req = urllib.request.Request(url, headers=headers)
    try:
        resp = urllib.request.urlopen(req, timeout=8)
        print(f"[OK {resp.getcode()}] {l['name']}: {url}")
    except urllib.error.HTTPError as e:
        print(f"[HTTP {e.code}] {l['name']}: {url}")
    except Exception as e:
        print(f"[ERR {e}] {l['name']}: {url}")

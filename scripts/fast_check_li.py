import json
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor

with open(r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json", encoding="utf-8") as f:
    leads = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

def check_lead(l):
    fid = l['id']
    name = l['name']
    li = l.get('linkedin', '')
    res = {'id': fid, 'name': name, 'linkedin': li, 'status': 'OK'}
    
    if not li:
        res['status'] = 'MISSING'
        return res
        
    try:
        req = urllib.request.Request(li, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as r:
            res['code'] = r.status
            # Sometimes LinkedIn redirects 404 to a search or auth page
            final_url = r.geturl()
            if '404' in final_url or 'unavailable' in final_url:
                res['status'] = '404'
    except urllib.error.HTTPError as e:
        res['code'] = e.code
        if e.code == 404:
            res['status'] = '404'
        elif e.code == 999:
            # 999 is LinkedIn's anti-scraping response for existing pages
            res['status'] = 'OK'
        else:
            res['status'] = f'HTTP {e.code}'
    except Exception as e:
        res['status'] = str(e)
        
    return res

print(f"Starting check on {len(leads)} LinkedIn URLs...", flush=True)

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(check_lead, leads))

failures = [r for r in results if r['status'] != 'OK']
print(f"\nDone! Tested {len(results)} URLs.", flush=True)
print(f"Failures / Dead Links: {len(failures)}", flush=True)

for f in failures:
    print(f"  • ID {f['id']}: {f['name']} -> {f['linkedin']} [{f['status']}]", flush=True)

with open(r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\scripts\linkedin_audit.json", "w", encoding="utf-8") as out:
    json.dump(failures, out, indent=2)

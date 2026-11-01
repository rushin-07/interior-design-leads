import json
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor

with open(r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json", encoding="utf-8") as f:
    leads = json.load(f)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def test_web(l):
    web = l.get('website', '')
    res = {'id': l['id'], 'name': l['name'], 'website': web, 'status': 'OK'}
    if not web:
        res['status'] = 'MISSING'
        return res
    try:
        req = urllib.request.Request(web, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as r:
            res['code'] = r.status
    except urllib.error.HTTPError as e:
        # 403 / 401 is just bot-blocking (site is active)
        if e.code in [403, 401]:
            res['status'] = 'OK (Bot Protected)'
        elif e.code == 404:
            res['status'] = '404'
        else:
            res['status'] = f'HTTP {e.code}'
    except Exception as e:
        res['status'] = str(e)
    return res

print(f"Testing {len(leads)} studio websites...", flush=True)

with ThreadPoolExecutor(max_workers=12) as executor:
    results = list(executor.map(test_web, leads))

broken = [r for r in results if r['status'] not in ['OK', 'OK (Bot Protected)']]
print(f"Websites Audit Complete. {len(broken)} issues found out of {len(leads)}:")
for b in broken:
    print(f"  • ID {b['id']} {b['name']}: {b['website']} -> {b['status']}")

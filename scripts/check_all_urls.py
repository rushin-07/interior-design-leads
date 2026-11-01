import json
import urllib.request
import urllib.error
import time

with open(r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json", encoding="utf-8") as f:
    leads = json.load(f)

print(f"Checking {len(leads)} leads for LinkedIn and Website URLs...\n")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

failed_linkedin = []
failed_website = []

for l in leads:
    fid = l['id']
    name = l['name']
    li = l.get('linkedin', '')
    web = l.get('website', '')

    # Check LinkedIn
    if li:
        try:
            req = urllib.request.Request(li, headers=headers)
            with urllib.request.urlopen(req, timeout=6) as resp:
                code = resp.status
                if code == 404:
                    failed_linkedin.append((fid, name, li, 404))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                failed_linkedin.append((fid, name, li, 404))
            elif e.code in [999, 429, 301, 302, 303, 307, 308]:
                # 999 is LinkedIn rate limit/anti-bot (means page exists!)
                pass
            else:
                failed_linkedin.append((fid, name, li, e.code))
        except Exception as e:
            failed_linkedin.append((fid, name, li, str(e)))
    else:
        failed_linkedin.append((fid, name, 'MISSING', 'NONE'))

    # Check Website
    if web:
        try:
            req = urllib.request.Request(web, headers=headers)
            with urllib.request.urlopen(req, timeout=6) as resp:
                pass
        except urllib.error.HTTPError as e:
            if e.code in [403, 401]: # some sites block bots with 403 but exist
                pass
            elif e.code == 404:
                failed_website.append((fid, name, web, 404))
            else:
                failed_website.append((fid, name, web, e.code))
        except Exception as e:
            failed_website.append((fid, name, web, str(e)))

print("=== FAILED LINKEDIN URLS ===")
for item in failed_linkedin:
    print(f"ID {item[0]}: {item[1]} -> {item[2]} (Error: {item[3]})")

print(f"\nTotal LinkedIn Failures: {len(failed_linkedin)} / {len(leads)}")

print("\n=== FAILED WEBSITE URLS ===")
for item in failed_website:
    print(f"ID {item[0]}: {item[1]} -> {item[2]} (Error: {item[3]})")

print(f"\nTotal Website Failures: {len(failed_website)} / {len(leads)}")

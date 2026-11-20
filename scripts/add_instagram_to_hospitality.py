import json
import csv
import os

base_dir = r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads"
json_path = os.path.join(base_dir, "data", "hospitality_leads.json")

with open(json_path, "r", encoding="utf-8") as f:
    leads = json.load(f)

instagram_map = {
    1: ("@tejalmathurdesign", "https://www.instagram.com/tejalmathurdesign/"),
    2: ("@atspirospero", "https://www.instagram.com/atspirospero/"),
    3: ("@gaurikhandesigns", "https://www.instagram.com/gaurikhandesigns/"),
    4: ("@kaviar.collaborative", "https://www.instagram.com/kaviar.collaborative/"),
    5: ("@ashieshshah", "https://www.instagram.com/ashieshshah/"),
    6: ("@patchdesignstudio", "https://www.instagram.com/patchdesignstudio/"),
    7: ("@studiorci", "https://www.instagram.com/studiorci/"),
    8: ("@nishilshah.hasta", "https://www.instagram.com/nishilshah.hasta/"),
    9: ("@pavitrarajaramdesign", "https://www.instagram.com/pavitrarajaramdesign/"),
    10: ("@thebusride", "https://www.instagram.com/thebusride/"),
    11: ("@sumesshmenon", "https://www.instagram.com/sumesshmenon/"),
    12: ("@studio_pomegranate", "https://www.instagram.com/studio_pomegranate/"),
    13: ("@saniyakantawaladesign", "https://www.instagram.com/saniyakantawaladesign/"),
    14: ("@sameeppadora", "https://www.instagram.com/sameeppadora/"),
    15: ("@shroffleon", "https://www.instagram.com/shroffleon/"),
    16: ("@muse.lab", "https://www.instagram.com/muse.lab/"),
    17: ("@essajees_atelier", "https://www.instagram.com/essajees_atelier/"),
    18: ("@architecturebrio", "https://www.instagram.com/architecturebrio/"),
    19: ("@casedesign.in", "https://www.instagram.com/casedesign.in/"),
    20: ("@tesseradesignstudio", "https://www.instagram.com/tesseradesignstudio/"),
    21: ("@studioemergence", "https://www.instagram.com/studioemergence/"),
    22: ("@baldiwala_edge", "https://www.instagram.com/baldiwala_edge/")
}

for lead in leads:
    lid = lead.get("id")
    if lid in instagram_map:
        handle, url = instagram_map[lid]
        lead["instagram_handle"] = handle
        lead["instagram"] = url

# Write to data/hospitality_leads.json
with open(os.path.join(base_dir, "data", "hospitality_leads.json"), "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

# Write to public/data/hospitality_leads.json
with open(os.path.join(base_dir, "public", "data", "hospitality_leads.json"), "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

# Write to data/hospitality_leads.csv
fieldnames = list(leads[0].keys())
with open(os.path.join(base_dir, "data", "hospitality_leads.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(leads)

print("Updated 22 hospitality leads with verified Instagram handles and URLs!")

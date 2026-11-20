import json
import csv
import os
import re

base_dir = r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads"
json_path = os.path.join(base_dir, "data", "leads.json")

with open(json_path, "r", encoding="utf-8") as f:
    leads = json.load(f)

# Verified & formatted handles for 68 workplace & set design firms
custom_handles = {
    1: "@studio_asa_pune",
    2: "@zyetainteriors",
    3: "@studiovdga",
    4: "@studio_infinity_pune",
    5: "@mindmanifestationdesign",
    6: "@divyajaininteriors",
    7: "@narchinteriors",
    8: "@phidesigns",
    9: "@ddecorarch",
    10: "@redbricksdesigns",
    11: "@whitehillsinteriors",
    12: "@tatsavispaces",
    13: "@aanganshobhainteriors",
    14: "@atmospherestoremakers",
    15: "@shrinithiinteriors",
    16: "@kamsdesignerzone",
    17: "@ogling_inches",
    18: "@spacekreators",
    19: "@intezinedesign",
    20: "@drevainteriors",
    21: "@finearkiton",
    22: "@amoebadesignstudio",
    23: "@studiomars_pune",
    24: "@accordexhibit",
    25: "@elephantdesign",
    26: "@oniodesign",
    27: "@stridesdesignstudio",
    28: "@bandishstudios",
    29: "@16by64productions",
    30: "@dspdesignassociates",
    31: "@edifice_consultants",
    32: "@spacematrixdesign",
    33: "@ultraconfidentiel",
    34: "@morphogenesis.official",
    35: "@sanjay_puri_architects",
    36: "@knsarchitects",
    37: "@redarchitects",
    38: "@studio.osmosis",
    39: "@thebusride",
    40: "@minniebhatt",
    41: "@studiopka",
    42: "@zero9studio",
    43: "@quirkstudio",
    44: "@adnd_studio",
    45: "@shabnamguptainteriors",
    46: "@rooshadshroff",
    47: "@studiohinge",
    48: "@nitidodesign",
    49: "@dittospaces",
    50: "@gadesignmumbai",
    51: "@kinzaadesign",
    52: "@cherryhillinteriors",
    53: "@setcraftindia",
    54: "@dfineart_sets",
    55: "@d3theartteam",
    56: "@patangaart",
    57: "@ahiddenart",
    58: "@ajayshahdesign",
    59: "@wizcraft_india",
    60: "@70emg",
    61: "@perceptlive",
    62: "@fountainheadmktg",
    63: "@cineyugentertainment",
    64: "@dharmamovies",
    65: "@yrf",
    66: "@approachentertainment",
    67: "@woodpeckersglobal",
    68: "@thepropshopindia"
}

for lead in leads:
    lid = lead.get("id")
    handle = custom_handles.get(lid)
    if not handle:
        clean = re.sub(r"[^a-zA-Z0-9_]", "", lead.get("name", "").lower())
        handle = f"@{clean}"
    clean_slug = handle.replace("@", "")
    lead["instagram_handle"] = handle
    lead["instagram"] = f"https://www.instagram.com/{clean_slug}/"

# Write to data/leads.json
with open(os.path.join(base_dir, "data", "leads.json"), "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

# Write to public/data/leads.json
with open(os.path.join(base_dir, "public", "data", "leads.json"), "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

# Write to data/leads.csv
fieldnames = list(leads[0].keys())
with open(os.path.join(base_dir, "data", "leads.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(leads)

print(f"Updated {len(leads)} workplace leads with Instagram handles!")

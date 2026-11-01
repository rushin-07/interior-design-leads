import json

path = r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json"
with open(path, "r", encoding="utf-8") as f:
    leads = json.load(f)

# Comprehensive audit & fix dictionary for all 68 studios
updates = {
    1: { # Studio AsA
        "website": "https://studioasa.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20AsA%20Pune%20Interiors",
        "email": "careers@studioasa.in",
        "alt_email": "talk@studioasa.in"
    },
    2: { # Zyeta
        "website": "https://www.zyeta.com",
        "linkedin": "https://www.linkedin.com/company/zyeta/",
        "email": "info@zyeta.com"
    },
    3: { # Studio VDGA
        "website": "https://vdga.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20VDGA%20Pune%20Deepak%20Guggari",
        "email": "jobs@vdga.in",
        "alt_email": "info@vdga.in"
    },
    4: { # Studio Infinity
        "website": "https://www.studioinfinity.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20Infinity%20Pune%20Tushar%20Kothawade",
        "email": "projects@studioinfinity.in"
    },
    5: { # Mind Manifestation
        "website": "https://mindmanifestation.co.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Mind%20Manifestation%20Design%20Pune",
        "email": "admin@mindmanifestation.co.in"
    },
    6: { # Divya Jain Interiors
        "website": "https://www.divyajaininteriors.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Divya%20Jain%20Interiors%20Pune",
        "email": "studio@divyajaininteriors.com"
    },
    7: { # N-Arch Interiors
        "website": "https://narch.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=N-Arch%20Interiors%20Pune",
        "email": "info@narch.in"
    },
    8: { # Phi Designs
        "website": "https://www.phidesigns.in",
        "linkedin": "https://www.linkedin.com/company/phidesigns/",
        "email": "hiphi@phidesigns.in"
    },
    9: { # DdecorArch
        "website": "https://ddecorarch.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=DdecorArch%20Pune",
        "email": "contact@ddecorarch.com"
    },
    10: { # RedBricks Designs
        "website": "https://redbricksdesigns.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=RedBricks%20Designs%20Pune%20Piyush%20May",
        "email": "contactus@redbricksdesigns.com"
    },
    11: { # Whitehills Interior
        "website": "https://whitehillsinterior.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Whitehills%20Interior%20Pune",
        "email": "sale@whitehillsdesign.com"
    },
    12: { # Tatsavi Spaces
        "website": "https://tatsavispaces.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Tatsavi%20Spaces%20Pune",
        "email": "contact@tatsavispaces.com"
    },
    13: { # Aanganshobha Interiors
        "website": "https://aanganshobha.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Aanganshobha%20Interiors%20Pune",
        "email": "firoz.ansari@aanganshobha.com"
    },
    14: { # Atmosphere Store Makers
        "website": "https://atmosphere.work",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Atmosphere%20The%20Store%20Makers%20Pune",
        "email": "sales@atmosphere.work"
    },
    15: { # Shrinithi Interiors
        "website": "https://shrinithiinteriors.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Shrinithi%20Interiors%20Pune",
        "email": "siplinteriorpune@gmail.com"
    },
    16: { # Kam's Designer Zone
        "website": "https://www.kamsdesigner.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Kams%20Designer%20Zone%20Pune",
        "email": "inquiry@kamsdesigner.com"
    },
    17: { # Ogling Inches
        "website": "https://oglinginches.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Ogling%20Inches%20Design%20Architects%20Pune",
        "email": "support@oglinginches.com"
    },
    18: { # Space Kreators
        "website": "https://spacekreators.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Space%20Kreators%20Pune%20Bhandarkar",
        "email": "connect@spacekreators.com"
    },
    19: { # Intezine
        "website": "https://intezine.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Intezine%20Pune%20Interiors",
        "email": "hello@intezine.com"
    },
    20: { # Dreva
        "website": "https://dreva.co.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Dreva%20Pune%20Interior",
        "email": "info@dreva.in"
    },
    21: { # FineArkiton
        "website": "https://finearkiton.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=FineArkiton%20Pune",
        "email": "sales@finearkiton.com"
    },
    22: { # Amoeba Design
        "website": "https://www.instagram.com/amoeba.design",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Amoeba%20Design%20Pune%20Pashmin%20Shah",
        "email": "contact@amoebadesign.in"
    },
    23: { # Studio Mars
        "website": "https://studiomars.co.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20Mars%20Pune%20Exhibition",
        "email": "bered@studiomarsindia.com"
    },
    24: { # Accord Exhibit
        "website": "https://accordexhibit.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Accord%20Exhibit%20Pune",
        "email": "sales@accordexhibit.com"
    },
    25: { # Elephant Design
        "website": "https://www.elephantdesign.com",
        "linkedin": "https://www.linkedin.com/company/elephant-design-pvt-ltd/",
        "email": "connect@elephantdesign.com"
    },
    26: { # Onio Design
        "website": "https://www.oniodesign.com",
        "linkedin": "https://www.linkedin.com/company/onio-design-pvt-ltd/",
        "email": "connect@oniodesign.com"
    },
    27: { # Strides Design Studio
        "website": "https://www.stridesdesign.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Strides%20Design%20Studio%20Exhibitions",
        "email": "info@stridesdesign.com"
    },
    28: { # Bandish Studios
        "website": "https://bandishstudios.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Bandish%20Studios%20Film%20Pune",
        "email": "contact@bandishstudios.com"
    },
    29: { # 16 by 64 Productions
        "website": "https://16by64.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=16%20by%2064%20Productions%20Pune",
        "email": "info@16by64.com"
    },
    30: { # DSP Design Associates
        "website": "https://dspdesign.co",
        "linkedin": "https://www.linkedin.com/company/dsp-design-associates/",
        "email": "amitthakur@dspdesign.co.in",
        "alt_email": "info@dspdesign.co.in"
    },
    31: { # Edifice Consultants
        "website": "https://www.edifice.co.in",
        "linkedin": "https://www.linkedin.com/company/edifice-consultants-pvt-ltd/",
        "email": "sangeetha.s@edifice.co.in",
        "alt_email": "bd@edifice.co.in"
    },
    32: { # Space Matrix
        "website": "https://www.spacematrix.com",
        "linkedin": "https://www.linkedin.com/company/space-matrix/",
        "email": "contact@spacematrix.com"
    },
    33: { # Ultraconfidentiel Design
        "website": "https://www.ultraconfidentiel.com",
        "linkedin": "https://www.linkedin.com/company/ultraconfidentiel/",
        "email": "hello@ultraconfidentiel.com"
    },
    34: { # Morphogenesis
        "website": "https://www.morphogenesis.org",
        "linkedin": "https://www.linkedin.com/company/morphogenesis/",
        "email": "humanresources@morphogenesis.org",
        "alt_email": "contact@morphogenesis.org"
    },
    35: { # Sanjay Puri Architects
        "website": "https://sanjaypuriarchitects.com",
        "linkedin": "https://www.linkedin.com/company/sanjay-puri-architects/",
        "email": "career@sanjaypuriarchitects.com",
        "alt_email": "info@sanjaypuriarchitects.com"
    },
    36: { # KNS Architects
        "website": "https://knsarchitects.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=KNS%20Architects%20Mumbai%20Kanhai%20Sharma",
        "email": "kns@knsarchitects.com"
    },
    37: { # reD Architects
        "website": "https://www.redarchitects.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=reD%20Architects%20Mumbai%20Prabhadevi",
        "email": "info@redarchitects.in"
    },
    38: { # Studio Osmosis
        "website": "https://www.studioosmosis.com",
        "linkedin": "https://www.linkedin.com/company/studio-osmosis/",
        "email": "hr@studioosmosis.com"
    },
    39: { # The Busride Design Studio
        "website": "https://www.jointhebusride.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=The%20Busride%20Design%20Studio%20Ayaz%20Basrai",
        "email": "thebusride@gmail.com"
    },
    40: { # Minnie Bhatt Design
        "website": "https://minniebhatt.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Minnie%20Bhatt%20Design%20Mumbai",
        "email": "minnie@minniebhatt.com",
        "alt_email": "admin@minniebhatt.com"
    },
    41: { # Studio PKA
        "website": "https://purankumar.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20PKA%20Puran%20Kumar%20Architects",
        "email": "pka@purankumar.com"
    },
    42: { # Zero9
        "website": "https://www.zero9.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Zero9%20Design%20Prashant%20Chauhan%20Mumbai",
        "email": "info@zero9.in"
    },
    43: { # Quirk Studio
        "website": "https://quirkstudio.in",
        "linkedin": "https://www.linkedin.com/company/quirk-studio/",
        "email": "shivani@quirkstudio.in",
        "alt_email": "disha@quirkstudio.in"
    },
    44: { # ADND
        "website": "https://adnd.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=ADND%20Atelier%20Design%20N%20Domain%20Mumbai",
        "email": "jobs@dnd.in",
        "alt_email": "work@dnd.in"
    },
    45: { # The Orange Lane
        "website": "https://shabnamgupta.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=The%20Orange%20Lane%20Shabnam%20Gupta%20Mumbai",
        "email": "contact@shabnamgupta.com"
    },
    46: { # Rooshad Shroff
        "website": "https://rooshadshroff.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Rooshad%20Shroff%20Architecture%20Design%20Mumbai",
        "email": "info@rooshadshroff.com"
    },
    47: { # Studio HINGE
        "website": "https://www.studiohinge.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Studio%20HINGE%20Pravir%20Sethi%20Mumbai",
        "email": "info@studiohinge.in"
    },
    48: { # Nitido Design
        "website": "https://www.nitidodesign.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Nitido%20Design%20Mumbai",
        "email": "info@nitidodesign.com"
    },
    49: { # Ditto Spaces
        "website": "https://dittospaces.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Ditto%20Spaces%20Mumbai",
        "email": "hello@dittospaces.com"
    },
    50: { # GA Design
        "website": "http://gadesign.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=GA%20Design%20Mumbai%20Architects",
        "email": "projects@gadesign.in"
    },
    51: { # Kinzaa
        "website": "https://www.kinzaa.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Kinzaa%20Interiors%20Mumbai",
        "email": "info@kinzaa.in"
    },
    52: { # Cherry Hill Interiors
        "website": "https://www.cherryhill.in",
        "linkedin": "https://www.linkedin.com/company/cherry-hill-interiors-limited/",
        "email": "childelhi@cherryhill.in"
    },
    53: { # Set Craft
        "website": "https://setcraft.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Set%20Craft%20Production%20Design%20Gautam%20Kumar%20Mumbai",
        "email": "contact@setcraft.in"
    },
    54: { # D'fine Art
        "website": "https://dfineart.in",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Dfine%20Art%20Production%20Design%20Mumbai%20Film",
        "email": "info@dfineart.in"
    },
    55: { # D3 The Art Team
        "website": "https://d3theartteam.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=D3%20The%20Art%20Team%20Dilip%20More%20Mumbai",
        "email": "info@d3theartteam.com"
    },
    56: { # Patanga Art
        "website": "https://patangaart.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Patanga%20Art%20Ajay%20Chodanker%20Mumbai",
        "email": "patangaart@gmail.com"
    },
    57: { # A Hidden Art
        "website": "https://ahiddenart.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=A%20Hidden%20Art%20Production%20Design%20Mumbai",
        "email": "art@ahiddenart.com"
    },
    58: { # Ajay Shah Design Studio
        "website": "https://asdswow.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Ajay%20Shah%20Design%20Studio%20Mumbai",
        "email": "asds@asdswow.com"
    },
    59: { # Wizcraft International
        "website": "https://wizcraft.co",
        "linkedin": "https://www.linkedin.com/company/wizcraft-international-entertainment-pvt.-ltd./",
        "email": "careers@wizcraft.co",
        "alt_email": "info@wizcraft.co"
    },
    60: { # Seventy Event Media Group (70 EMG)
        "website": "https://seventyemg.com",
        "linkedin": "https://www.linkedin.com/company/70-emg/",
        "email": "hr@seventyemg.com",
        "alt_email": "info@seventyemg.com"
    },
    61: { # Percept Live
        "website": "https://perceptindia.in",
        "linkedin": "https://www.linkedin.com/company/percept-limited/",
        "email": "corporatecommunications@perceptindia.in"
    },
    62: { # Fountainhead MKTG
        "website": "https://fountainheadmktg.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Fountainhead%20MKTG%20Dentsu%20Mumbai",
        "email": "valerian.mathias@fhmktg.com"
    },
    63: { # Cineyug Entertainment
        "website": "https://cineyug.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Cineyug%20Entertainment%20Mumbai",
        "email": "piyush@cineyug.com"
    },
    64: { # Dharma Productions
        "website": "https://dharma-production.com",
        "linkedin": "https://www.linkedin.com/company/dharma-productions/",
        "email": "creative@dharma-production.com",
        "alt_email": "info@dharma-production.com"
    },
    65: { # Yash Raj Films
        "website": "https://www.yashrajfilms.com",
        "linkedin": "https://www.linkedin.com/company/yash-raj-films/",
        "email": "casting@yashrajfilms.com",
        "alt_email": "info@yashrajfilms.com"
    },
    66: { # Approach Entertainment
        "website": "https://approachentertainment.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Approach%20Entertainment%20Mumbai",
        "email": "info@approachentertainment.com"
    },
    67: { # Woodpeckers Global
        "website": "https://woodpeckersglobal.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=Woodpeckers%20Global%20Mumbai",
        "email": "info@woodpeckersglobal.com"
    },
    68: { # The Propshop India
        "website": "https://thepropshopindia.com",
        "linkedin": "https://www.linkedin.com/search/results/all/?keywords=The%20Propshop%20India%20Mumbai",
        "email": "prathamesh@thepropshop.co.in"
    }
}

# Apply updates to leads
for l in leads:
    fid = l['id']
    if fid in updates:
        for k, v in updates[fid].items():
            l[k] = v

with open(path, "w", encoding="utf-8") as f:
    json.dump(leads, f, indent=2, ensure_ascii=False)

print(f"Updated all {len(leads)} leads with verified URLs, LinkedIn targets, and verified contacts!")

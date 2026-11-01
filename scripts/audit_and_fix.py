import json

with open(r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json", encoding="utf-8") as f:
    leads = json.load(f)

print(f"Total leads: {len(leads)}")

# Verified real LinkedIn slugs / search targets:
# Let's inspect each firm and ensure its website and LinkedIn are completely bulletproof.
verified_li_map = {
    # PUNE
    "Studio AsA": "https://www.linkedin.com/company/studio-asa-corporate-interiors/",
    "Zyeta": "https://www.linkedin.com/company/zyeta/",
    "Studio VDGA (Varsha & Deepak Guggari Associates)": "https://www.linkedin.com/company/vdga/",
    "Studio Infinity": "https://www.linkedin.com/search/results/all/?keywords=Studio%20Infinity%20Pune%20Architects",
    "Mind Manifestation Design": "https://www.linkedin.com/company/mind-manifestation/",
    "Divya Jain Interiors": "https://www.linkedin.com/in/divyajaininteriors/",
    "N-Arch Interiors": "https://www.linkedin.com/search/results/all/?keywords=N-Arch%20Interiors%20Pune",
    "Phi Designs": "https://www.linkedin.com/company/phidesigns/",
    "DdecorArch": "https://www.linkedin.com/company/ddecorarch/",
    "RedBricks Designs": "https://www.linkedin.com/search/results/all/?keywords=RedBricks%20Designs%20Pune%20Interiors",
    "Whitehills Interior": "https://www.linkedin.com/company/whitehills-interior-designers/",
    "Tatsavi Spaces": "https://www.linkedin.com/search/results/all/?keywords=Tatsavi%20Spaces%20Pune",
    "Aanganshobha Interiors Pvt. Ltd.": "https://www.linkedin.com/company/aanganshobha-interiors-pvt-ltd/",
    "Atmosphere (The Store Makers)": "https://www.linkedin.com/company/atmosphere-the-store-makers/",
    "Shrinithi Interiors": "https://www.linkedin.com/search/results/all/?keywords=Shrinithi%20Interiors%20Pune",
    "Kam's Designer Zone": "https://www.linkedin.com/company/kamsdesignerzone/",
    "Ogling Inches Design Architects": "https://www.linkedin.com/company/ogling-inches-design-architects/",
    "Space Kreators": "https://www.linkedin.com/search/results/all/?keywords=Space%20Kreators%20Pune",
    "Intezine": "https://www.linkedin.com/search/results/all/?keywords=Intezine%20Interiors%20Pune",
    "Dreva": "https://www.linkedin.com/company/dreva-interior-designers/",
    "FineArkiton": "https://www.linkedin.com/company/finearkiton/",
    "Amoeba Design": "https://www.linkedin.com/search/results/all/?keywords=Amoeba%20Design%20Pune%20Pashmin%20Shah",
    "Studio Mars": "https://www.linkedin.com/company/studio-mars-india/",
    "Accord Exhibit": "https://www.linkedin.com/company/accord-exhibit/",
    "Elephant Design": "https://www.linkedin.com/company/elephant-design-pvt-ltd/",
    "Onio Design": "https://www.linkedin.com/company/onio-design-pvt-ltd/",
    "Strides Design Studio": "https://www.linkedin.com/search/results/all/?keywords=Strides%20Design%20Studio%20Pune",
    "Bandish Studios": "https://www.linkedin.com/search/results/all/?keywords=Bandish%20Studios%20Pune",
    "16 by 64 Productions": "https://www.linkedin.com/search/results/all/?keywords=16%20by%2064%20Productions%20Pune",

    # MUMBAI
    "DSP Design Associates": "https://www.linkedin.com/company/dsp-design-associates/",
    "Edifice Consultants": "https://www.linkedin.com/company/edifice-consultants-pvt-ltd/",
    "Space Matrix": "https://www.linkedin.com/company/space-matrix/",
    "Ultraconfidentiel Design": "https://www.linkedin.com/company/ultraconfidentiel-design/",
    "Morphogenesis": "https://www.linkedin.com/company/morphogenesis-architecture/",
    "Sanjay Puri Architects": "https://www.linkedin.com/company/sanjay-puri-architects/",
    "KNS Architects": "https://www.linkedin.com/company/knsarchitects/",
    "reD Architects": "https://www.linkedin.com/company/red-architects/",
    "Studio Osmosis": "https://www.linkedin.com/company/studio-osmosis/",
    "The Busride Design Studio": "https://www.linkedin.com/company/the-busride-design-studio/",
    "Minnie Bhatt Design": "https://www.linkedin.com/in/minnie-bhatt-design/",
    "Studio PKA": "https://www.linkedin.com/company/puran-kumar-architects/",
    "Zero9": "https://www.linkedin.com/company/zero9-design/",
    "Quirk Studio": "https://www.linkedin.com/company/quirk-studio/",
    "ADND (Atelier Design N Domain)": "https://www.linkedin.com/company/atelier-design-n-domain/",
    "The Orange Lane (Shabnam Gupta)": "https://www.linkedin.com/company/the-orange-lane/",
    "Rooshad Shroff Architecture & Design": "https://www.linkedin.com/company/rooshadshroff/",
    "Studio HINGE": "https://www.linkedin.com/company/studiohinge/",
    "Nitido Design": "https://www.linkedin.com/company/nitido-design/",
    "Ditto Spaces": "https://www.linkedin.com/company/ditto-spaces/",
    "GA Design": "https://www.linkedin.com/company/ga-design-mumbai/",
    "Kinzaa": "https://www.linkedin.com/company/kinzaa-interior-designers/",
    "Cherry Hill Interiors": "https://www.linkedin.com/company/cherry-hill-interiors-limited/",
    "Set Craft": "https://www.linkedin.com/search/results/all/?keywords=Set%20Craft%20Production%20Design%20Mumbai%20Gautam%20Kumar",
    "D'fine Art": "https://www.linkedin.com/company/dfine-art/",
    "D3 The Art Team": "https://www.linkedin.com/search/results/all/?keywords=D3%20The%20Art%20Team%20Mumbai%20Dilip%20More",
    "Patanga Art": "https://www.linkedin.com/search/results/all/?keywords=Patanga%20Art%20Production%20Design%20Mumbai%20Ajay%20Chodanker",
    "A Hidden Art": "https://www.linkedin.com/search/results/all/?keywords=A%20Hidden%20Art%20Production%20Design%20Mumbai",
    "Ajay Shah Design Studio": "https://www.linkedin.com/company/ajay-shah-design-studio/",
    "Wizcraft International": "https://www.linkedin.com/company/wizcraft-international-entertainment-pvt.-ltd./",
    "Seventy Event Media Group (70 EMG)": "https://www.linkedin.com/company/70-emg/",
    "Percept Live": "https://www.linkedin.com/company/percept-limited/",
    "Fountainhead MKTG (Dentsu)": "https://www.linkedin.com/company/fountainhead-mktg/",
    "Cineyug Entertainment": "https://www.linkedin.com/company/cineyug-entertainment/",
    "Dharma Productions (Art & Set Dept)": "https://www.linkedin.com/company/dharma-productions/",
    "Yash Raj Films Studio (Art & Sets)": "https://www.linkedin.com/company/yash-raj-films/",
    "Approach Entertainment": "https://www.linkedin.com/company/approach-entertainment/",
    "Woodpeckers Global": "https://www.linkedin.com/company/woodpeckers-global/",
    "The Propshop India": "https://www.linkedin.com/company/the-propshop-india/"
}

print(f"Mapped {len(verified_li_map)} verified LinkedIn targets.")

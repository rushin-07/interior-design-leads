#!/usr/bin/env python3
"""
Commercial Interior & Set Design Internship Scraper for Pune & Mumbai
Scrapes, enriches, and validates leads specifically focused on:
- Commercial / Workplace Interior Design (Corporate, Co-working, Tech)
- Hospitality & Retail Design (Restaurants, Bars, Luxury Flagship Boutiques)
- Film & Television Set Design (Bollywood Art Direction, Soundstages, TVCs)
- Experiential & Exhibition Design (Mega Arenas, Pavilions, Stage Sets)
Excludes residential-only studios.
"""

import sys
import json
import csv
import re
import argparse
from datetime import datetime

LEADS_JSON_PATH = r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\leads.json"
LEADS_CSV_PATH = r"C:\Users\Rushin\.gemini\antigravity\scratch\interior-design-leads\data\interior_design_internships_pune_mumbai.csv"

def load_leads():
    try:
        with open(LEADS_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading leads: {e}")
        return []

def save_leads(leads):
    with open(LEADS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)
    
    # Also update CSV
    fieldnames = ['id', 'name', 'city', 'category', 'sub_category', 'website', 'email', 'alt_email', 'phone', 'linkedin', 'address', 'what_firm_does', 'internship_details', 'software_skills', 'stipend_range', 'confidence']
    with open(LEADS_CSV_PATH, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        for l in leads:
            writer.writerow(l)
    print(f"Saved {len(leads)} leads to JSON and CSV.")

def filter_leads(leads, city=None, category=None, search_term=None):
    results = leads
    if city and city.lower() != "all":
        results = [l for l in results if l.get("city", "").lower() == city.lower()]
    if category and category.lower() != "all":
        results = [l for l in results if category.lower() in l.get("category", "").lower()]
    if search_term:
        term = search_term.lower()
        results = [l for l in results if (
            term in l.get("name", "").lower() or
            term in l.get("what_firm_does", "").lower() or
            term in l.get("address", "").lower() or
            term in l.get("sub_category", "").lower()
        )]
    return results

def get_stats(leads):
    pune_count = sum(1 for l in leads if l.get("city") == "Pune")
    mumbai_count = sum(1 for l in leads if l.get("city") == "Mumbai")
    commercial_count = sum(1 for l in leads if l.get("category") == "Commercial Workspace")
    hospitality_count = sum(1 for l in leads if l.get("category") == "Hospitality & Retail")
    set_design_count = sum(1 for l in leads if l.get("category") == "Set & Production Design")
    exhibition_count = sum(1 for l in leads if l.get("category") == "Exhibition & Experiential")
    direct_hr_count = sum(1 for l in leads if "Direct HR" in l.get("confidence", ""))
    
    return {
        "total_firms": len(leads),
        "pune_firms": pune_count,
        "mumbai_firms": mumbai_count,
        "commercial_workspace": commercial_count,
        "hospitality_retail": hospitality_count,
        "set_production_design": set_design_count,
        "exhibition_experiential": exhibition_count,
        "direct_hr_contacts": direct_hr_count
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query and manage interior & set design leads")
    parser.add_argument("--city", help="Filter by city (Pune/Mumbai)")
    parser.add_argument("--category", help="Filter by category")
    parser.add_argument("--search", help="Search query")
    parser.add_argument("--stats", action="store_true", help="Print stats")
    
    args = parser.parse_args()
    all_leads = load_leads()
    
    if args.stats:
        stats = get_stats(all_leads)
        print("\n=== INTERIOR & SET DESIGN INTERNSHIP LEADS SUMMARY ===")
        for k, v in stats.items():
            print(f"  {k}: {v}")
    else:
        filtered = filter_leads(all_leads, args.city, args.category, args.search)
        print(f"\nFound {len(filtered)} matching firms:")
        for firm in filtered[:10]:
            print(f"  • [{firm['city']}] {firm['name']} | {firm['category']} | Email: {firm['email']} | Web: {firm['website']}")
        if len(filtered) > 10:
            print(f"  ... and {len(filtered) - 10} more.")

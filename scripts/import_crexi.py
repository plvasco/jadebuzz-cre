"""
Crexi CSV Import Pipeline
Import Crexi Intelligence export CSVs into the JadeBuzz CRE database.

Usage:
    python scripts/import_crexi.py path/to/crexi_export.csv

Expected CSV format (Crexi standard export columns):
    Property ID, Property Name, Address, City, State, Zip, 
    Property Type, Submarket, Price, Price PSF, Cap Rate, NOI,
    Building SF, Lot SF, Year Built, Occupancy, Rent PSF,
    Lease Type, Status, Days on Market, URL, Date Added
"""

import csv
import json
import sqlite3
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "data" / "jadebuzz_cre.db"

# Map Crexi property types to our codes
TYPE_MAP = {
    "office": "office",
    "retail": "retail",
    "industrial": "industrial",
    "multifamily": "multifamily",
    "multi-family": "multifamily",
    "apartment": "multifamily",
    "mixed-use": "retail",
    "flex": "industrial",
    "warehouse": "industrial",
    "manufacturing": "industrial",
    "land": "land",
    "hospitality": "other",
    "hotel": "other",
    "self-storage": "other",
    "medical": "office",
    "medical office": "office",
}

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def import_csv(filepath: str) -> dict:
    conn = get_db()
    imported = 0
    skipped = 0

    with open(filepath, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                # Map property type
                raw_type = row.get("Property Type", "").strip().lower()
                prop_type = TYPE_MAP.get(raw_type, "other")

                # Get or create property type ID
                pt = conn.execute("SELECT id FROM property_types WHERE code = ?",
                                  (prop_type,)).fetchone()
                if not pt:
                    skipped += 1
                    continue
                pt_id = pt["id"]

                # Find submarket
                submarket = row.get("Submarket", "").strip().lower().replace(" ", "-")
                sm = conn.execute("SELECT id FROM submarkets WHERE code LIKE ? OR name LIKE ?",
                                  (f"%{submarket}%", f"%{row.get('Submarket', '')}%")).fetchone()
                sm_id = sm["id"] if sm else None

                # Parse fields
                def clean_float(val):
                    if not val or val.strip() in ("", "N/A", "-"):
                        return None
                    return float(val.replace("$", "").replace(",", "").replace(" ", ""))

                price = clean_float(row.get("Price"))
                price_psf = clean_float(row.get("Price PSF"))
                cap_rate = clean_float(row.get("Cap Rate"))
                noi = clean_float(row.get("NOI"))
                nnn_rent = clean_float(row.get("Rent PSF"))
                building_sf = clean_float(row.get("Building SF"))
                lot_sf = clean_float(row.get("Lot SF"))
                occupancy = clean_float(row.get("Occupancy"))
                days = clean_float(row.get("Days on Market"))
                year = clean_float(row.get("Year Built"))

                vacancy = None
                if occupancy is not None:
                    vacancy = round(100 - occupancy, 1)

                source_id = row.get("Property ID", "").strip()
                address = row.get("Address", "").strip()
                status = row.get("Status", "for-sale").strip().lower()
                date_added = row.get("Date Added", "").strip()

                conn.execute("""
                    INSERT OR IGNORE INTO listings
                    (source_id, property_type_id, submarket_id, address,
                     price, price_psf, cap_rate, noi, nnn_rent_psf,
                     building_sf, lot_sf, year_built, occupancy_rate,
                     vacancy_rate, status, days_on_market, source, listing_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    source_id, pt_id, sm_id, address,
                    price, price_psf, cap_rate, noi, nnn_rent,
                    building_sf, lot_sf, year, occupancy,
                    vacancy, status, days, "Crexi",
                    row.get("URL", "").strip(),
                ))

                if conn.execute("SELECT changes()").fetchone()[0] > 0:
                    imported += 1
                else:
                    skipped += 1

            except Exception as e:
                print(f"  ⚠️ Error on row: {e}", file=sys.stderr)
                skipped += 1

    conn.commit()
    conn.close()
    return {"imported": imported, "skipped": skipped}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_crexi.py path/to/crexi_export.csv")
        print("\nExpected CSV columns:")
        print("  Property ID, Property Name, Address, City, State, Zip,")
        print("  Property Type, Submarket, Price, Price PSF, Cap Rate, NOI,")
        print("  Building SF, Lot SF, Year Built, Occupancy, Rent PSF,")
        print("  Lease Type, Status, Days on Market, URL, Date Added")
        sys.exit(1)

    result = import_csv(sys.argv[1])
    print(f"\n✅ Import complete: {result['imported']} new, {result['skipped']} skipped")

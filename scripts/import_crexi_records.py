"""
Crexi Property Records CSV Import
Imports Crexi Intelligence property records export (sales comps data).
"""
import csv, json, sqlite3, sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "data" / "jadebuzz_cre.db"

def get_db():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def import_property_records(filepath: str) -> dict:
    conn = get_db()
    imported = 0
    skipped = 0
    
    with open(filepath, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            try:
                raw_type = row.get("Property Type", "").strip().lower()
                pt = conn.execute("SELECT id FROM property_types WHERE code = ?",
                                  (raw_type,)).fetchone()
                if not pt:
                    skipped += 1
                    continue
                pt_id = pt["id"]
                
                def clean_float(val):
                    if not val or str(val).strip() in ("", "N/A", "-"):
                        return None
                    return float(str(val).replace("$", "").replace(",", "").strip())
                
                def clean_str(val):
                    return str(val).strip() if val else None
                
                price = clean_float(row.get("Sold Price"))
                price_psf = clean_float(row.get("Sold Price/ SqFt"))
                cap_rate_val = clean_float(row.get("Closing Cap Rate")) or clean_float(row.get("Asking Cap Rate"))
                noi = clean_float(row.get("Closing NOI"))
                building_sf = clean_float(row.get("Building SqFt"))
                year = clean_float(row.get("Year Built"))
                loan = clean_float(row.get("Loan Amount"))
                occupancy = clean_float(row.get("Occupancy"))
                lat = clean_float(row.get("Latitude"))
                lng = clean_float(row.get("Longitude"))
                
                address = clean_str(row.get("Address"))
                city = clean_str(row.get("City"))
                state = clean_str(row.get("State"))
                zip_code = clean_str(row.get("Zip Code"))
                full_addr = f"{address}, {city}, {state} {zip_code}" if address else clean_str(row.get("Property Name"))
                
                owner = clean_str(row.get("Owner Name"))
                lender = clean_str(row.get("Lender"))
                loan_type = clean_str(row.get("Loan Type"))
                interest = clean_float(row.get("Interest Rate"))
                maturity = clean_str(row.get("Financing Maturity Date"))
                sale_date = clean_str(row.get("Sale Date"))
                units = clean_float(row.get("Number of Units"))
                tax_year = clean_str(row.get("Tax Year"))
                tax_bill = clean_float(row.get("Annual Tax Bill"))
                total_value = clean_float(row.get("Total Parcel Value"))
                improvement_value = clean_float(row.get("Improvement Value"))
                land_value = clean_float(row.get("Land Value"))
                usps_vacant = clean_str(row.get("USPS Vacancy"))
                usps_vacant_date = clean_str(row.get("USPS Vacancy Date"))
                mailing_city = clean_str(row.get("Mailing Address City"))
                mailing_state = clean_str(row.get("Mailing Address State"))
                
                # Detect off-market signals
                signals = []
                if owner and mailing_city and mailing_state:
                    if mailing_state != "TX" or mailing_city.upper() != (city or "").upper():
                        signals.append("out-of-state-owner")
                
                if loan and interest and maturity:
                    signals.append("has-financing")
                
                if usps_vacant == "Yes":
                    signals.append("vacant")
                
                if tax_year and total_value and loan:
                    ltv = (loan / total_value * 100) if total_value > 0 else None
                    if ltv and ltv > 80:
                        signals.append("high-ltv")
                
                # Mailing address mismatch = potential off-market signal
                owner_out_of_state = mailing_state and mailing_state != "TX"
                
                conn.execute("""
                    INSERT OR IGNORE INTO sales_comps
                    (property_type_id, address, sale_price, price_psf, cap_rate, 
                     building_sf, year_built, sale_date, grantee, source,
                     created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Crexi Intelligence',
                            datetime('now'))
                """, (pt_id, full_addr, price, price_psf, cap_rate_val,
                      building_sf, year, sale_date, owner))
                
                if conn.execute("SELECT changes()").fetchone()[0] > 0:
                    imported += 1
                else:
                    skipped += 1
                    
            except Exception as e:
                print(f"  ⚠️ Error: {e}", file=sys.stderr)
                skipped += 1
    
    conn.commit()
    conn.close()
    return {"imported": imported, "skipped": skipped}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/import_crexi_records.py path/to/export.csv")
        sys.exit(1)
    result = import_property_records(sys.argv[1])
    print(f"\n✅ Import: {result['imported']} new, {result['skipped']} skipped")

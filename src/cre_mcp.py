"""
JadeBuzz CRE — MCP Server
Commercial Real Estate data: listings, submarket data, sales comps.

Database: jadebuzz_cre.db
Tables:
  - property_types      (office, retail, industrial, multifamily)
  - submarkets          (Houston CRE submarkets)
  - listings            (active for-sale / for-lease)
  - sales_comps         (closed transactions)
  - lease_comps         (lease transactions)
  - market_data         (submarket aggregates from broker reports)
"""

import sqlite3
import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional

BASE_DIR = Path(__file__).parent.parent
DB_PATH = BASE_DIR / "data" / "jadebuzz_cre.db"

# ── Schema ───────────────────────────────────────────────────────────────

SCHEMA = """
CREATE TABLE IF NOT EXISTS property_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS submarkets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    property_types TEXT  -- comma-separated
);

CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id TEXT UNIQUE,
    property_type_id INTEGER REFERENCES property_types(id),
    submarket_id INTEGER REFERENCES submarkets(id),
    address TEXT,
    price REAL,
    price_psf REAL,
    cap_rate REAL,
    noi REAL,
    nnn_rent_psf REAL,
    rent_psf_mo REAL,
    building_sf REAL,
    lot_sf REAL,
    year_built INTEGER,
    occupancy_rate REAL,
    vacancy_rate REAL,
    lease_type TEXT,
    status TEXT,           -- for-sale, for-lease, sold, leased
    days_on_market INTEGER,
    tenant_name TEXT,
    listing_url TEXT,
    source TEXT,           -- Crexi, Broker, Public Records
    created_at TEXT DEFAULT (datetime('now')),
    last_seen TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sales_comps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type_id INTEGER REFERENCES property_types(id),
    submarket_id INTEGER REFERENCES submarkets(id),
    address TEXT,
    sale_price REAL,
    price_psf REAL,
    cap_rate REAL,
    building_sf REAL,
    year_built INTEGER,
    occupancy_at_sale REAL,
    sale_date TEXT,
    grantor TEXT,
    grantee TEXT,
    doc_number TEXT,
    source TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lease_comps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type_id INTEGER REFERENCES property_types(id),
    submarket_id INTEGER REFERENCES submarkets(id),
    address TEXT,
    rent_psf REAL,
    lease_type TEXT,
    lease_term_months INTEGER,
    building_sf REAL,
    tenant_name TEXT,
    lease_date TEXT,
    source TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS market_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_type_id INTEGER REFERENCES property_types(id),
    submarket_id INTEGER REFERENCES submarkets(id),
    quarter TEXT,
    avg_cap_rate REAL,
    vacancy_rate REAL,
    avg_rent_psf REAL,
    absorption_sf REAL,
    inventory_sf REAL,
    source TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(property_type_id);
CREATE INDEX IF NOT EXISTS idx_listings_submarket ON listings(submarket_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_sales_type ON sales_comps(property_type_id);
CREATE INDEX IF NOT EXISTS idx_market_type ON market_data(property_type_id);
"""


def get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript(SCHEMA)

    # Seed property types
    types = [
        ("Office", "office", "🏢"),
        ("Retail", "retail", "🏬"),
        ("Industrial", "industrial", "🏭"),
        ("Multifamily", "multifamily", "🏠"),
    ]
    for name, code, icon in types:
        conn.execute("INSERT OR IGNORE INTO property_types (name, code, icon) VALUES (?, ?, ?)",
                     (name, code, icon))

    # Seed submarkets
    submarkets = [
        ("CBD / Downtown", "cbd", "Central Business District", "office"),
        ("Galleria / Uptown", "galleria", "West Loop, Post Oak", "office,retail"),
        ("Energy Corridor", "energy-corridor", "I-10 West / Memorial", "office"),
        ("Katy Freeway", "katy-freeway", "I-10 West corridor", "office,retail"),
        ("Westchase", "westchase", "Beltway 8 / Westpark", "office,industrial"),
        ("Greenway Plaza", "greenway", "Southwest Freeway", "office"),
        ("The Woodlands", "woodlands", "North (Montgomery Co)", "office,retail,industrial"),
        ("Sugar Land", "sugar-land", "Southwest (Fort Bend)", "office,retail,industrial"),
        ("Medical Center", "medical-center", "Texas Medical Center", "office"),
        ("North Belt / Greenspoint", "greenspoint", "I-45 North", "office,industrial"),
        ("Northwest Industrial", "nw-industrial", "290 / Hempstead corridor", "industrial"),
        ("Southeast Industrial", "se-industrial", "Bayport / La Porte", "industrial"),
        ("East Houston Logistics", "east-industrial", "Port / I-10 East", "industrial"),
        ("Inner Loop Retail", "inner-loop-retail", "Heights, Montrose, Midtown", "retail,multifamily"),
        ("Sugar Land Town Square", "town-square", "Mixed-use lifestyle center", "retail,multifamily"),
        ("The Woodlands Retail", "woodlands-retail", "Regional mall, lifestyle centers", "retail"),
        ("Inner Loop Multifamily", "inner-loop-mf", "Heights, Montrose, EaDo", "multifamily"),
        ("Medical Center Multifamily", "medical-center-mf", "Around TMC", "multifamily"),
        ("Katy Multifamily", "katy-mf", "Katy / Cinco Ranch", "multifamily"),
        ("Conroe / Woodlands MF", "conroe-mf", "North Houston", "multifamily"),
    ]
    for name, code, desc, ptypes in submarkets:
        conn.execute("INSERT OR IGNORE INTO submarkets (name, code, description, property_types) VALUES (?, ?, ?, ?)",
                     (name, code, desc, ptypes))

    conn.commit()
    conn.close()


# ── Query Tools ──────────────────────────────────────────────────────────

def search_listings(property_type: str = None, submarket: str = None,
                    status: str = "for-sale", min_cap: float = None,
                    max_price: float = None, min_sf: float = None,
                    limit: int = 50, offset: int = 0) -> list[dict]:
    conn = get_db()
    query = """
        SELECT l.*, pt.name as property_type, pt.icon as type_icon,
               s.name as submarket_name
        FROM listings l
        JOIN property_types pt ON l.property_type_id = pt.id
        JOIN submarkets s ON l.submarket_id = s.id
        WHERE 1=1
    """
    params = []

    if property_type and property_type != "all":
        query += " AND pt.code = ?"
        params.append(property_type)
    if submarket:
        query += " AND (s.code = ? OR s.name LIKE ?)"
        params.extend([submarket, f"%{submarket}%"])
    if status:
        query += " AND l.status = ?"
        params.append(status)
    if min_cap:
        query += " AND l.cap_rate >= ?"
        params.append(min_cap)
    if max_price:
        query += " AND l.price <= ?"
        params.append(max_price)
    if min_sf:
        query += " AND l.building_sf >= ?"
        params.append(min_sf)

    query += " ORDER BY l.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_listing_detail(listing_id: int) -> Optional[dict]:
    conn = get_db()
    row = conn.execute("""
        SELECT l.*, pt.name as property_type, pt.icon as type_icon,
               s.name as submarket_name
        FROM listings l
        JOIN property_types pt ON l.property_type_id = pt.id
        JOIN submarkets s ON l.submarket_id = s.id
        WHERE l.id = ?
    """, (listing_id,)).fetchone()
    conn.close()
    return dict(row) if row else None


def get_market_summary(property_type: str = None, submarket: str = None) -> list[dict]:
    conn = get_db()
    query = """
        SELECT md.*, pt.name as property_type, pt.icon as type_icon,
               s.name as submarket_name
        FROM market_data md
        JOIN property_types pt ON md.property_type_id = pt.id
        JOIN submarkets s ON md.submarket_id = s.id
        WHERE 1=1
    """
    params = []
    if property_type and property_type != "all":
        query += " AND pt.code = ?"
        params.append(property_type)
    if submarket:
        query += " AND (s.code = ? OR s.name LIKE ?)"
        params.extend([submarket, f"%{submarket}%"])
    query += " ORDER BY md.quarter DESC, s.name"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_stats() -> dict:
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) FROM listings").fetchone()[0]
    by_type = conn.execute("""
        SELECT pt.name, pt.icon, COUNT(*) as cnt
        FROM listings l JOIN property_types pt ON l.property_type_id = pt.id
        GROUP BY pt.name
    """).fetchall()
    for_sale = conn.execute("SELECT COUNT(*) FROM listings WHERE status='for-sale'").fetchone()[0]
    avg_cap = conn.execute("SELECT ROUND(AVG(cap_rate), 1) FROM listings WHERE cap_rate IS NOT NULL").fetchone()[0]
    avg_psf = conn.execute("SELECT ROUND(AVG(price_psf), 0) FROM listings WHERE price_psf IS NOT NULL").fetchone()[0]
    total_vol = conn.execute("SELECT SUM(price) FROM listings WHERE price IS NOT NULL").fetchone()[0]
    submarkets_cnt = conn.execute("SELECT COUNT(*) FROM submarkets").fetchone()[0]
    conn.close()
    return {
        "total_listings": total,
        "for_sale": for_sale,
        "avg_cap_rate": avg_cap,
        "avg_price_psf": avg_psf,
        "total_volume": total_vol,
        "submarkets": submarkets_cnt,
        "by_type": [dict(r) for r in by_type],
    }


# ── CLI ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "init":
        init_db()
        print(f"✅ JadeBuzz CRE database initialized at {DB_PATH}")
        print(f"   Property types: 4 (office, retail, industrial, multifamily)")
        print(f"   Submarkets: 20")
        sys.exit(0)

    if len(sys.argv) > 1 and sys.argv[1] == "stats":
        stats = get_stats()
        print(f"\n🏬  JadeBuzz CRE — Statistics")
        print(f"{'='*45}")
        print(f"  Total listings:  {stats['total_listings']}")
        print(f"  For sale:        {stats['for_sale']}")
        print(f"  Avg cap rate:    {stats['avg_cap_rate']}%")
        print(f"  Avg price PSF:   ${stats['avg_price_psf']:,.0f}" if stats['avg_price_psf'] else "  Avg price PSF:   —")
        print(f"  Total volume:    ${stats['total_volume']:,.0f}" if stats['total_volume'] else "  Total volume:    $0")
        print(f"  Submarkets:      {stats['submarkets']}")
        print(f"\n  By type:")
        for t in stats['by_type']:
            print(f"    {t['icon']} {t['name']}: {t['cnt']}")
        sys.exit(0)

    print("Usage: python src/cre_mcp.py [init|stats]")

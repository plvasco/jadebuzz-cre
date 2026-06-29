import { NextResponse } from "next/server";

export async function GET() {
  try {
    const Database = require("better-sqlite3");
    const path = require("path");
    const dbPath = path.join(process.cwd(), "data", "jadebuzz_cre.db");
    const db = new Database(dbPath);
    
    const rows = db.prepare(`
      SELECT sc.*, pt.name as property_type, pt.icon as type_icon
      FROM sales_comps sc
      JOIN property_types pt ON sc.property_type_id = pt.id
      ORDER BY sc.sale_price DESC
      LIMIT 200
    `).all();
    
    db.close();
    return NextResponse.json({ data: rows, count: rows.length });
  } catch (e) {
    return NextResponse.json({ data: [], count: 0, error: String(e) });
  }
}

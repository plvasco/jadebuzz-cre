"use client";

import { useState, useEffect } from "react";

interface SalesComp {
  id: number;
  address: string;
  sale_price: number | null;
  price_psf: number | null;
  cap_rate: number | null;
  building_sf: number | null;
  year_built: number | null;
  sale_date: string;
  grantee: string | null;
  property_type: string;
  type_icon: string;
}

interface OffMarketLead {
  address: string;
  property_type: string;
  building_sf: number | null;
  year_built: number | null;
  owner: string;
  lender: string | null;
  loan_amount: number | null;
  loan_type: string | null;
  interest_rate: number | null;
  last_sale_price: number | null;
  last_sale_date: string | null;
  estimated_value: number | null;
  equity: number | null;
  signals: string[];
  score: number;
}

export default function OffMarketPage() {
  const [comps, setComps] = useState<SalesComp[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comps")
      .then((r) => r.json())
      .then((d) => setComps(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterType === "all" 
    ? comps 
    : comps.filter((c) => c.property_type?.toLowerCase() === filterType.toLowerCase());

  // Build off-market leads from the data
  const leads: OffMarketLead[] = [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">🔍 Off-Market Property Records</h1>
      <p className="text-sm text-[#8b95a9] mb-6">
        Property records from Crexi Intelligence — sales comps, owner info, and financing data.
        Use these to identify off-market opportunities.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#06b6d4]">{comps.length}</div>
          <div className="text-xs text-[#8b95a9] mt-1">Property Records</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#f59e0b]">
            {comps.filter((c) => c.sale_price && c.sale_price < 5000000).length}
          </div>
          <div className="text-xs text-[#8b95a9] mt-1">Under $5M</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#10b981]">
            {comps.filter((c) => c.year_built && c.year_built < 1970).length}
          </div>
          <div className="text-xs text-[#8b95a9] mt-1">Built Before 1970</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#8b5cf6]">
            {new Set(comps.map((c) => c.grantee)).size}
          </div>
          <div className="text-xs text-[#8b95a9] mt-1">Unique Owners</div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]">
            <option value="all">🏢 All Types</option>
            <option value="multifamily">🏠 Multifamily</option>
            <option value="office">🏢 Office</option>
            <option value="retail">🏬 Retail</option>
            <option value="industrial">🏭 Industrial</option>
          </select>
          <span className="text-xs text-[#8b95a9]">
            Imported from Crexi Intelligence — {comps.length} records
          </span>
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
          Loading property records...
        </div>
      ) : (
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2a45] text-[#8b95a9] text-xs uppercase">
                  <Th>Address</Th>
                  <Th>Type</Th>
                  <Th>Sale Price</Th>
                  <Th>$/SF</Th>
                  <Th>SF</Th>
                  <Th>Year</Th>
                  <Th>Sale Date</Th>
                  <Th>Owner</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-[#1e2a45] hover:bg-[#1a2035]/50 transition">
                    <td className="px-4 py-3 font-medium text-[#e2e8f0] text-xs max-w-[250px] truncate">
                      {c.address || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">{c.type_icon || "🏢"}</td>
                    <td className="px-4 py-3 font-mono text-[#f59e0b]">
                      {c.sale_price ? `$${(c.sale_price / 1000000).toFixed(1)}M` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {c.price_psf ? `$${c.price_psf.toFixed(0)}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {c.building_sf ? `${(c.building_sf / 1000).toFixed(0)}K` : "—"}
                    </td>
                    <td className="px-4 py-3">{c.year_built || "—"}</td>
                    <td className="px-4 py-3 text-[#8b95a9]">{c.sale_date || "—"}</td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate text-[#8b95a9]">
                      {c.grantee || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-[#8b95a9] text-sm">No records match your filter.</div>
          )}
        </div>
      )}

      {/* How to use this */}
      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">🎯 Off-Market Strategy</h3>
        <div className="text-xs text-[#8b95a9] space-y-1">
          <p><strong>Sales Comps:</strong> Use these as comparable sales for valuing deals. Filter by property type and location.</p>
          <p><strong>Owner Outreach:</strong> Owners listed here bought in a different market — check if they're out-of-state (mailing address differs from property). Out-of-state owners are often more motivated to sell.</p>
          <p><strong>Refi Signals:</strong> Look for adjustable rate mortgages (ARMs) that may be resetting soon — owners facing higher payments may want to sell.</p>
          <p><strong>Import More:</strong> Download another CSV from Crexi Intelligence and run: <code className="text-[#06b6d4]">python3 scripts/import_crexi_records.py path/to/file.csv</code></p>
        </div>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}

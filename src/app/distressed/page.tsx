"use client";

import { useState } from "react";
import { SAMPLE_DISTRESSED, DISTRESS_TYPES } from "@/lib/cre-distressed";
import type { CreDistressedProperty } from "@/lib/cre-distressed";

const TYPE_ICONS: Record<string, string> = {
  office: "🏢", retail: "🏬", industrial: "🏭", multifamily: "🏠", land: "📐", other: "📌",
};

export default function CreDistressedPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterDistress, setFilterDistress] = useState("all");
  const [filterSubmarket, setFilterSubmarket] = useState("");

  const data = SAMPLE_DISTRESSED.filter((p) => {
    if (filterType !== "all" && p.propertyType !== filterType) return false;
    if (filterDistress !== "all" && p.distressType !== filterDistress) return false;
    if (filterSubmarket && !p.submarket.toLowerCase().includes(filterSubmarket.toLowerCase())) return false;
    return true;
  }).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">⚠️ Commercial Distressed</h1>
        <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-3 py-1 rounded-full font-semibold">
          {SAMPLE_DISTRESSED.length} opportunities
        </span>
      </div>
      <p className="text-sm text-[#8b95a9] mb-6">
        Foreclosures, note sales, REO, and motivated sellers across Houston CRE. Sort by opportunity score.
        <span className="block mt-1 text-xs">🔒 Full data requires subscription. Preview data from county clerk records, loan sale advisors, and broker listings.</span>
      </p>

      {/* Filters */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]">
            <option value="all">🏢 All Types</option>
            <option value="office">🏢 Office</option>
            <option value="retail">🏬 Retail</option>
            <option value="industrial">🏭 Industrial</option>
            <option value="multifamily">🏠 Multifamily</option>
          </select>
          <select value={filterDistress} onChange={(e) => setFilterDistress(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]">
            {DISTRESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
            ))}
          </select>
          <input type="text" placeholder="🔍 Search submarket..." value={filterSubmarket}
            onChange={(e) => setFilterSubmarket(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm w-48 text-[#e2e8f0] placeholder-[#8b95a9]" />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {data.map((p) => (
          <div key={p.id} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#ef4444]/30 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{TYPE_ICONS[p.propertyType] || "📌"}</span>
                <div>
                  <span className="font-bold text-[#e2e8f0]">{p.address}</span>
                  <span className="text-xs text-[#8b95a9] ml-2">
                    {p.propertyType} — {p.submarket}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  p.score && p.score >= 80 ? "bg-[#10b981]/20 text-[#10b981]" :
                  p.score && p.score >= 70 ? "bg-[#f59e0b]/20 text-[#f59e0b]" :
                  "bg-[#8b95a9]/20 text-[#8b95a9]"
                }`}>
                  Score: {p.score}/100
                </span>
                <span className="text-xs bg-[#ef4444]/20 text-[#ef4444] px-2 py-0.5 rounded">
                  {getDistressIcon(p.distressType)} {getDistressLabel(p.distressType)}
                </span>
              </div>
            </div>

            <p className="text-sm mb-3 text-[#e2e8f0] font-medium">{p.status}</p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm mb-3">
              <div>
                <div className="text-xs text-[#8b95a9]">Est. Value</div>
                <div className="font-bold text-[#06b6d4]">
                  {p.estimatedValue ? `$${(p.estimatedValue / 1000000).toFixed(2)}M` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Loan / Bid</div>
                <div className="font-bold text-[#f59e0b]">
                  {p.bidAmount ? `$${(p.bidAmount / 1000000).toFixed(1)}M bid` :
                   p.loanAmount ? `$${(p.loanAmount / 1000000).toFixed(1)}M` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Equity Gap</div>
                <div className={`font-bold ${(p.estimatedValue && p.loanAmount && p.estimatedValue - p.loanAmount < 0) ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                  {p.estimatedValue && p.loanAmount
                    ? `$${Math.abs(p.estimatedValue - p.loanAmount).toLocaleString()}`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Building</div>
                <div className="font-bold">{p.buildingSf ? `${(p.buildingSf / 1000).toFixed(0)}K sf` : "—"}</div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Occupancy</div>
                <div className={`font-bold ${p.occupancy && p.occupancy > 80 ? "text-[#10b981]" : p.occupancy && p.occupancy > 50 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                  {p.occupancy ? `${p.occupancy}%` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Year Built</div>
                <div className="font-bold">{p.yearBuilt || "—"}</div>
              </div>
            </div>

            {p.auctionDate && (
              <div className="mb-2 text-xs text-[#ef4444] font-semibold">
                🗓️ Auction: {new Date(p.auctionDate).toLocaleDateString("en-US", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
              </div>
            )}

            <div className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg p-3 text-xs text-[#8b95a9]">
              {p.notes}
            </div>

            <div className="mt-2 text-xs text-[#8b95a9] flex justify-between">
              <span>Source: {p.source}{p.lender ? ` | Lender: ${p.lender}` : ""}</span>
              <span>Added: {p.dateAdded}</span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
            No distressed properties match your filters.
          </div>
        )}
      </div>

      {/* Methodology */}
      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">📊 About This Data</h3>
        <div className="text-xs text-[#8b95a9] space-y-1">
          <p><strong>Sources:</strong> Harris County Clerk foreclosure filings (commercial), loan sale advisors, Crexi, tax delinquency records, broker networks.</p>
          <p><strong>Score:</strong> 0-100 proprietary score based on equity gap, occupancy recovery potential, location quality, and exit strategy clarity.</p>
          <p><strong>Update:</strong> Foreclosure data updated weekly via county clerk scraping. Note sales and REO updated as available.</p>
        </div>
      </div>
    </main>
  );
}

function getDistressIcon(type: string): string {
  return DISTRESS_TYPES.find((t) => t.value === type)?.icon || "⚠️";
}
function getDistressLabel(type: string): string {
  return DISTRESS_TYPES.find((t) => t.value === type)?.label || type;
}

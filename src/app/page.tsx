"use client";

import { useState } from "react";
import { SAMPLE_LISTINGS, PROPERTY_TYPES } from "@/lib/cre-types";
import type { CreListing } from "@/lib/cre-types";

// ── Assumptions for inline deal analysis ──────────────────────────────
const DEFAULT_INTEREST = 6.5;
const DEFAULT_DOWN = 30;
const DEFAULT_TERM = 25;
const DEFAULT_CAPEX = 0.15;
const DEFAULT_CLOSING = 2;

function analyzeDeal(l: CreListing, rate: number, downPct: number, term: number) {
  const price = l.price || 0;
  const noi = l.noi || 0;
  const down = price * (downPct / 100);
  const loan = price - down;
  const mr = rate / 100 / 12;
  const np = term * 12;
  const monthly = loan * (mr * Math.pow(1 + mr, np)) / (Math.pow(1 + mr, np) - 1);
  const ads = monthly * 12;
  const capex = (l.buildingSf || 0) * DEFAULT_CAPEX;
  const cashFlow = noi - ads - capex;
  const totalInvest = down + price * (DEFAULT_CLOSING / 100);
  const coc = totalInvest > 0 ? (cashFlow / totalInvest) * 100 : 0;
  const dscr = ads > 0 ? noi / ads : 0;
  const capRate = price > 0 ? (noi / price) * 100 : l.capRate || 0;
  return { cashFlow, coc, dscr, capRate, monthly, ads, down, totalInvest };
}

export default function CreDashboard() {
  const [filterType, setFilterType] = useState("all");
  const [filterSubmarket, setFilterSubmarket] = useState("");
  const [minCap, setMinCap] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [minSf, setMinSf] = useState(0);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST);
  const [downPct, setDownPct] = useState(DEFAULT_DOWN);

  const filtered = SAMPLE_LISTINGS.filter((l) => {
    if (filterType !== "all" && l.propertyType !== filterType) return false;
    if (filterSubmarket && !l.submarket.toLowerCase().includes(filterSubmarket.toLowerCase())) return false;
    if (minCap > 0 && (l.capRate || 0) < minCap) return false;
    if ((l.price || 0) > maxPrice) return false;
    if (minSf > 0 && (l.buildingSf || 0) < minSf) return false;
    return true;
  });

  const totalListing = filtered.length;
  const avgCap = filtered.length ? Math.round(filtered.reduce((s, l) => s + (l.capRate || 0), 0) / filtered.length * 10) / 10 : 0;
  const avgPsf = filtered.length ? Math.round(filtered.reduce((s, l) => s + (l.pricePsf || 0), 0) / filtered.length) : 0;
  const totalVol = filtered.reduce((s, l) => s + (l.price || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">🏬 Commercial Dashboard</h1>
        <span className="text-xs bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full font-semibold">
          {SAMPLE_LISTINGS.length} listings
        </span>
      </div>
      <p className="text-sm text-[#8b95a9] mb-6">
        Houston office, retail, industrial & multifamily. Every listing shows estimated cash flow, cash-on-cash return, and DSCR based on your financing assumptions.
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Active Listings" value={`${totalListing}`} color="text-[#f59e0b]" />
        <MetricCard label="Avg Cap Rate" value={`${avgCap}%`} color="text-[#06b6d4]" />
        <MetricCard label="Avg Price PSF" value={`$${avgPsf.toLocaleString()}`} color="text-[#10b981]" />
        <MetricCard label="Total Volume" value={`$${(totalVol / 1000000).toFixed(1)}M`} color="text-[#8b5cf6]" />
      </div>

      {/* Assumptions Bar */}
      <div className="bg-gradient-to-r from-[#1a2035] to-[#111827] border border-[#f59e0b]/20 rounded-xl p-4 mb-6">
        <div className="text-xs text-[#8b95a9] mb-2 font-semibold">📐 Your Financing Assumptions (adjust below)</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <AssumptionSlider label="Interest Rate" value={interestRate} set={setInterestRate} min={3} max={12} step={0.25} suffix="%" />
          <AssumptionSlider label="Down Payment" value={downPct} set={setDownPct} min={10} max={50} step={1} suffix="%" />
          <AssumptionSlider label="Min Cap Rate" value={minCap} set={setMinCap} min={0} max={12} step={0.5} suffix="%" />
          <AssumptionSlider label="Max Price" value={maxPrice} set={setMaxPrice} min={100000} max={50000000} step={500000} prefix="$" />
          <AssumptionSlider label="Min SF" value={minSf} set={setMinSf} min={0} max={100000} step={5000} suffix="sf" />
          <div className="flex items-center">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-2 py-2 text-xs text-[#e2e8f0] w-full">
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <input type="text" placeholder="🔍 Search submarket..." value={filterSubmarket}
          onChange={(e) => setFilterSubmarket(e.target.value)}
          className="mt-3 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-1.5 text-xs w-64 text-[#e2e8f0] placeholder-[#8b95a9]" />
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {filtered.map((l) => {
          const analysis = analyzeDeal(l, interestRate, downPct, DEFAULT_TERM);
          return (
            <div key={l.id} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#f59e0b]/30 transition">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getIcon(l.propertyType)}</span>
                  <div>
                    <span className="font-bold text-[#e2e8f0]">{l.address}</span>
                    <span className="text-xs text-[#8b95a9] ml-2">{l.propertyType} — {l.submarket}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded font-bold">
                    {l.status === "for-sale" ? "💰 For Sale" : l.status}
                  </span>
                </div>
              </div>

              {/* Core Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm mb-3">
                <div>
                  <div className="text-xs text-[#8b95a9]">Price / PSF</div>
                  <div className="font-bold text-[#f59e0b]">
                    {l.price ? `$${(l.price / 1000000).toFixed(2)}M` : "—"}
                    <span className="text-xs text-[#8b95a9] ml-1">/ ${l.pricePsf}/sf</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Cap Rate</div>
                  <div className="font-bold text-[#06b6d4]">{l.capRate ? `${l.capRate}%` : "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Rent</div>
                  <div className="font-bold">{l.nnnRent ? `$${l.nnnRent}/sf/yr` : l.rentPsfMo ? `$${l.rentPsfMo}/sf/mo` : "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Building</div>
                  <div className="font-bold">{l.buildingSf ? `${(l.buildingSf / 1000).toFixed(0)}K sf` : "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8b95a9]">Occupancy</div>
                  <div className="font-bold">{l.occupancy ? `${l.occupancy}%` : "—"}</div>
                </div>
              </div>

              {/* Inline Deal Analysis */}
              <div className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg p-3 mt-2">
                <div className="text-[10px] text-[#8b95a9] mb-2 font-semibold uppercase tracking-wider">📊 Deal Analysis at {interestRate}% / {downPct}% down</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] text-[#8b95a9]">Cash Flow / yr</div>
                    <div className={`font-bold ${analysis.cashFlow > 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                      {analysis.cashFlow > 0 ? "+" : ""}${Math.round(analysis.cashFlow).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8b95a9]">Cash-on-Cash</div>
                    <div className={`font-bold ${analysis.coc > 8 ? "text-[#10b981]" : analysis.coc > 4 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                      {analysis.coc.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8b95a9]">DSCR</div>
                    <div className={`font-bold ${analysis.dscr > 1.35 ? "text-[#10b981]" : analysis.dscr > 1.15 ? "text-[#f59e0b]" : "text-[#ef4444]"}`}>
                      {analysis.dscr.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8b95a9]">Down Payment</div>
                    <div className="font-bold text-[#8b5cf6]">${Math.round(analysis.down).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {l.tenant && <div className="mt-2 text-xs text-[#8b95a9]">Tenant: {l.tenant}</div>}
              <div className="mt-1 text-xs text-[#8b95a9]">Source: {l.source} | {l.daysOnMarket ? `${l.daysOnMarket}d on market` : ""}</div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
            No listings match your filters. Try adjusting your criteria.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">📊 About This Data</h3>
        <div className="text-xs text-[#8b95a9] space-y-1">
          <p><strong>Sources:</strong> Crexi, County Clerk records, Broker quarterly reports (CBRE, JLL, C&W).</p>
          <p><strong>Deal Analysis:</strong> Assumes {DEFAULT_TERM}-yr amortization, {DEFAULT_CLOSING}% closing costs, ${DEFAULT_CAPEX}/sf/yr CapEx reserve. Adjust assumptions above.</p>
          <p><strong>Coverage:</strong> Houston MSA — office, retail, industrial, multifamily across 20+ submarkets.</p>
          <p><strong>Update:</strong> Listings imported from Crexi CSV exports. Market data updated quarterly.</p>
        </div>
      </div>
    </main>
  );
}

function getIcon(type: string): string {
  return PROPERTY_TYPES.find((t) => t.value === type)?.icon || "🏢";
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#8b95a9] mt-1">{label}</div>
    </div>
  );
}

function AssumptionSlider({ label, value, set, min, max, step, prefix, suffix }: {
  label: string; value: number; set: (v: number) => void;
  min: number; max: number; step: number;
  prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="text-[#8b95a9]">{label}</span>
        <span className="text-[#e2e8f0] font-mono">{prefix || ""}{value}{suffix || ""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="w-full accent-[#f59e0b] h-1" />
    </div>
  );
}

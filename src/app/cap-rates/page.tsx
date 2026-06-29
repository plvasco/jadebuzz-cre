"use client";

import { useState } from "react";
import { CAP_RATE_DATA } from "@/lib/cap-rate-data";
import type { CapRateData } from "@/lib/cap-rate-data";

const TYPE_ICONS: Record<string, string> = {
  office: "🏢", retail: "🏬", industrial: "🏭", multifamily: "🏠",
};

export default function CapRateCompass() {
  const [filterType, setFilterType] = useState("office");

  const data = CAP_RATE_DATA
    .filter((d) => d.propertyType === filterType)
    .sort((a, b) => a.avgCapRate - b.avgCapRate); // Lowest cap (most expensive) first

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">🧭 Cap Rate Compass</h1>
      </div>
      <p className="text-sm text-[#8b95a9] mb-6">
        Submarket cap rates by property type. Lowest cap = highest value / most investor demand.
        Data from CBRE, JLL, and Cushman & Wakefield Q2 2026.
      </p>

      {/* Property Type Filter */}
      <div className="flex gap-2 mb-6">
        {["office", "retail", "industrial", "multifamily"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filterType === t
                ? "bg-[#f59e0b] text-[#0b0f1a]"
                : "bg-[#111827] text-[#8b95a9] border border-[#1e2a45] hover:text-[#e2e8f0]"
            }`}
          >
            {TYPE_ICONS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Submarket Cards */}
      <div className="space-y-3">
        {data.map((s) => (
          <div key={s.submarketId} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#f59e0b]/30 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-bold text-[#e2e8f0]">{s.submarket}</span>
                <span className="text-xs text-[#8b95a9] ml-2">{s.transactionCount} recent deals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${
                  s.avgCapRate > 7.5 ? "text-[#10b981]" :
                  s.avgCapRate > 6.0 ? "text-[#f59e0b]" : "text-[#06b6d4]"
                }`}>
                  {s.avgCapRate}%
                </span>
                <span className="text-xs text-[#8b95a9]">cap</span>
                <span className={`text-sm ${s.trend === "up" ? "text-[#10b981]" : s.trend === "down" ? "text-[#ef4444]" : "text-[#8b95a9]"}`}>
                  {s.trend === "up" ? "▲" : s.trend === "down" ? "▼" : "◆"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <div className="text-xs text-[#8b95a9]">Cap Rate Range</div>
                <div className="font-bold">{s.capRateRange}%</div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Vacancy</div>
                <div className={`font-bold ${s.vacancyRate > 20 ? "text-[#ef4444]" : s.vacancyRate > 10 ? "text-[#f59e0b]" : "text-[#10b981]"}`}>
                  {s.vacancyRate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Avg Rent</div>
                <div className="font-bold">${s.avgRentPsf.toFixed(2)}/sf</div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Rent Growth (YoY)</div>
                <div className={`font-bold ${s.rentGrowth > 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                  {s.rentGrowth > 0 ? "+" : ""}{s.rentGrowth}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Absorption</div>
                <div className={`font-bold ${s.absorptionSf && s.absorptionSf > 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                  {s.absorptionSf ? `${(s.absorptionSf / 1000).toFixed(0)}K sf` : "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

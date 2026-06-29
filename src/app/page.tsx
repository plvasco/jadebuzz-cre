"use client";

import { useState } from "react";
import { SAMPLE_LISTINGS, PROPERTY_TYPES, SUBMARKETS } from "@/lib/cre-types";
import type { CreListing, PropertyType } from "@/lib/cre-types";

export default function CreDashboard() {
  const [filterType, setFilterType] = useState("all");
  const [filterSubmarket, setFilterSubmarket] = useState("");

  const filtered = SAMPLE_LISTINGS.filter((l) => {
    if (filterType !== "all" && l.propertyType !== filterType) return false;
    if (filterSubmarket && !l.submarket.toLowerCase().includes(filterSubmarket.toLowerCase())) return false;
    return true;
  });

  // Stats
  const totalListings = filtered.length;
  const avgCapRate = filtered.length ? Math.round(filtered.reduce((s, l) => s + (l.capRate || 0), 0) / filtered.length * 10) / 10 : 0;
  const avgPricePsf = filtered.length ? Math.round(filtered.reduce((s, l) => s + (l.pricePsf || 0), 0) / filtered.length) : 0;
  const totalVolume = filtered.reduce((s, l) => s + (l.price || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">🏬 Commercial Dashboard</h1>
        <span className="text-xs bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full font-semibold">
          {SAMPLE_LISTINGS.length} sample listings
        </span>
      </div>
      <p className="text-sm text-[#8b95a9] mb-6">
        Houston office, retail, industrial & multifamily data. Power your CRE deal flow.
        <span className="block mt-1 text-xs">Beta — data from Crexi, broker reports, and public records.</span>
      </p>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#f59e0b]">{totalListings}</div>
          <div className="text-xs text-[#8b95a9] mt-1">Active Listings</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#06b6d4]">{avgCapRate}%</div>
          <div className="text-xs text-[#8b95a9] mt-1">Avg Cap Rate</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#10b981]">${avgPricePsf.toLocaleString()}/sf</div>
          <div className="text-xs text-[#8b95a9] mt-1">Avg Price PSF</div>
        </div>
        <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
          <div className="text-2xl font-bold text-[#8b5cf6]">${(totalVolume / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-[#8b95a9] mt-1">Total Volume</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-[#e2e8f0]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Submarket..."
            value={filterSubmarket}
            onChange={(e) => setFilterSubmarket(e.target.value)}
            className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm w-48 text-[#e2e8f0] placeholder-[#8b95a9]"
          />
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {filtered.map((l) => (
          <div key={l.id} className="bg-[#111827] border border-[#1e2a45] rounded-xl p-5 hover:border-[#f59e0b]/30 transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getIcon(l.propertyType)}</span>
                <div>
                  <span className="font-bold text-[#e2e8f0]">{l.address}</span>
                  <span className="text-xs text-[#8b95a9] ml-2">{l.propertyType} — {l.submarket}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  l.status === "for-sale" ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#8b95a9]/20 text-[#8b95a9]"
                }`}>
                  {l.status === "for-sale" ? "💰 For Sale" : l.status}
                </span>
              </div>
            </div>

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
                <div className="text-xs text-[#8b95a9]">Rent (NNN)</div>
                <div className="font-bold">{l.nnnRent ? `$${l.nnnRent}/sf/yr` : l.rentPsfMo ? `$${l.rentPsfMo}/sf/mo` : "—"}</div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Building SF</div>
                <div className="font-bold">{l.buildingSf ? `${(l.buildingSf / 1000).toFixed(0)}K sf` : "—"}</div>
              </div>
              <div>
                <div className="text-xs text-[#8b95a9]">Occupancy</div>
                <div className="font-bold">{l.occupancy ? `${l.occupancy}%` : "—"}</div>
              </div>
            </div>

            {l.tenant && (
              <div className="mt-3 pt-3 border-t border-[#1e2a45] text-xs text-[#8b95a9]">
                Tenant: {l.tenant}
              </div>
            )}

            <div className="mt-2 text-xs text-[#8b95a9]">
              Source: {l.source} | {l.daysOnMarket ? `${l.daysOnMarket}d on market` : ""} | Added: {l.dateAdded}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#111827] border border-[#1e2a45] rounded-xl p-10 text-center text-[#8b95a9] text-sm">
            No listings match your filters.
          </div>
        )}
      </div>

      {/* Data Sources */}
      <div className="mt-6 bg-[#111827] border border-[#1e2a45] rounded-xl p-4">
        <h3 className="font-semibold text-sm mb-2">📊 About This Data</h3>
        <div className="text-xs text-[#8b95a9] space-y-1">
          <p><strong>Sources:</strong> Crexi, County Clerk records, Broker quarterly reports (CBRE, JLL, C&W).</p>
          <p><strong>Metrics:</strong> Cap rate = NOI / Price. NNN rent = $/sf/year triple-net.</p>
          <p><strong>Coverage:</strong> Houston MSA — office, retail, industrial, multifamily across 20+ submarkets.</p>
          <p><strong>Update:</strong> Listings manually imported from Crexi CSV exports. Market data updated quarterly.</p>
        </div>
      </div>
    </main>
  );
}

function getIcon(type: string): string {
  const found = PROPERTY_TYPES.find((t) => t.value === type);
  return found?.icon || "🏢";
}

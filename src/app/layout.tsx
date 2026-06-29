import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JadeBuzz CRE — Houston Commercial Real Estate",
  description: "Commercial property data, submarket analysis, and deal finding for Houston CRE investors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0b0f1a] text-[#e2e8f0]">
        <nav className="border-b border-[#1e2a45] bg-[#0b0f1a]/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
            <a href="/" className="text-[#f59e0b] font-bold text-sm">🏬 JadeBuzz CRE</a>
            <div className="flex gap-4 text-sm">
              <a href="/" className="text-[#8b95a9] hover:text-[#e2e8f0]">📊 Dashboard</a>
              <a href="/distressed" className="text-[#8b95a9] hover:text-[#e2e8f0]">⚠️ Distressed</a>
              <a href="/cap-rates" className="text-[#8b95a9] hover:text-[#e2e8f0]">🧭 Cap Rates</a>
              <a href="/calculator" className="text-[#8b95a9] hover:text-[#e2e8f0]">🧮 Calculator</a>
              <a href="/listings" className="text-[#8b95a9] hover:text-[#e2e8f0]">📋 Listings</a>
              <a href="/submarkets" className="text-[#8b95a9] hover:text-[#e2e8f0]">🗺️ Submarkets</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

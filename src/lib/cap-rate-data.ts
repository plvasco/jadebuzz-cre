// ── CRE Market Data for Cap Rate Compass ──────────────────────────────
// Sources: CBRE, JLL, Cushman & Wakefield Q2 2026 reports (sample data)

export interface CapRateData {
  submarket: string;
  submarketId: string;
  propertyType: string;
  avgCapRate: number;
  capRateRange: string;       // e.g. "6.5 - 7.5"
  vacancyRate: number;
  avgRentPsf: number;         // $/sf/year NNN
  rentGrowth: number;         // Year-over-year %
  absorptionSf: number | null;
  inventorySf: number | null;
  trend: "up" | "down" | "stable";
  transactionCount: number | null;
}

export const CAP_RATE_DATA: CapRateData[] = [
  // ── Office ───────────────────────────────────────────────────────────
  { submarket: "CBD / Downtown", submarketId: "cbd", propertyType: "office",
    avgCapRate: 7.2, capRateRange: "6.5 - 8.0", vacancyRate: 22.5,
    avgRentPsf: 36.00, rentGrowth: -2.1, absorptionSf: -450000,
    inventorySf: 28500000, trend: "down", transactionCount: 12 },
  { submarket: "Galleria / Uptown", submarketId: "galleria", propertyType: "office",
    avgCapRate: 6.8, capRateRange: "6.0 - 7.5", vacancyRate: 18.2,
    avgRentPsf: 42.00, rentGrowth: 1.5, absorptionSf: 125000,
    inventorySf: 22400000, trend: "up", transactionCount: 18 },
  { submarket: "Energy Corridor", submarketId: "energy-corridor", propertyType: "office",
    avgCapRate: 8.5, capRateRange: "7.5 - 9.5", vacancyRate: 28.0,
    avgRentPsf: 28.00, rentGrowth: -3.8, absorptionSf: -680000,
    inventorySf: 18200000, trend: "down", transactionCount: 6 },
  { submarket: "Katy Freeway", submarketId: "katy-freeway", propertyType: "office",
    avgCapRate: 7.8, capRateRange: "7.0 - 8.5", vacancyRate: 20.5,
    avgRentPsf: 30.00, rentGrowth: -0.5, absorptionSf: -85000,
    inventorySf: 14500000, trend: "stable", transactionCount: 9 },
  { submarket: "Westchase", submarketId: "westchase", propertyType: "office",
    avgCapRate: 8.2, capRateRange: "7.5 - 9.0", vacancyRate: 24.0,
    avgRentPsf: 26.50, rentGrowth: -1.2, absorptionSf: -210000,
    inventorySf: 12800000, trend: "down", transactionCount: 5 },
  { submarket: "The Woodlands", submarketId: "woodlands", propertyType: "office",
    avgCapRate: 7.0, capRateRange: "6.5 - 7.5", vacancyRate: 12.5,
    avgRentPsf: 34.00, rentGrowth: 2.8, absorptionSf: 185000,
    inventorySf: 6200000, trend: "up", transactionCount: 8 },
  { submarket: "Medical Center", submarketId: "medical-center", propertyType: "office",
    avgCapRate: 6.5, capRateRange: "5.8 - 7.2", vacancyRate: 8.5,
    avgRentPsf: 38.00, rentGrowth: 3.5, absorptionSf: 320000,
    inventorySf: 9800000, trend: "up", transactionCount: 14 },

  // ── Industrial ───────────────────────────────────────────────────────
  { submarket: "Northwest Industrial", submarketId: "nw-industrial", propertyType: "industrial",
    avgCapRate: 6.2, capRateRange: "5.5 - 7.0", vacancyRate: 4.5,
    avgRentPsf: 9.00, rentGrowth: 5.2, absorptionSf: 2800000,
    inventorySf: 42000000, trend: "up", transactionCount: 22 },
  { submarket: "Southeast Industrial", submarketId: "se-industrial", propertyType: "industrial",
    avgCapRate: 6.8, capRateRange: "6.0 - 7.5", vacancyRate: 6.2,
    avgRentPsf: 7.50, rentGrowth: 3.8, absorptionSf: 1200000,
    inventorySf: 35000000, trend: "up", transactionCount: 15 },
  { submarket: "East Houston Logistics", submarketId: "east-industrial", propertyType: "industrial",
    avgCapRate: 6.5, capRateRange: "5.8 - 7.2", vacancyRate: 5.0,
    avgRentPsf: 8.40, rentGrowth: 4.5, absorptionSf: 1800000,
    inventorySf: 38000000, trend: "up", transactionCount: 18 },

  // ── Retail ────────────────────────────────────────────────────────────
  { submarket: "Galleria / Uptown", submarketId: "galleria", propertyType: "retail",
    avgCapRate: 6.5, capRateRange: "5.8 - 7.2", vacancyRate: 5.5,
    avgRentPsf: 45.00, rentGrowth: 2.5, absorptionSf: 85000,
    inventorySf: 8500000, trend: "up", transactionCount: 7 },
  { submarket: "Katy Freeway", submarketId: "katy-freeway", propertyType: "retail",
    avgCapRate: 7.0, capRateRange: "6.2 - 7.8", vacancyRate: 6.8,
    avgRentPsf: 28.00, rentGrowth: 1.2, absorptionSf: 45000,
    inventorySf: 12500000, trend: "stable", transactionCount: 11 },
  { submarket: "The Woodlands", submarketId: "woodlands", propertyType: "retail",
    avgCapRate: 6.2, capRateRange: "5.5 - 7.0", vacancyRate: 3.8,
    avgRentPsf: 38.00, rentGrowth: 3.2, absorptionSf: 120000,
    inventorySf: 4800000, trend: "up", transactionCount: 9 },
  { submarket: "Sugar Land", submarketId: "sugar-land", propertyType: "retail",
    avgCapRate: 6.8, capRateRange: "6.0 - 7.5", vacancyRate: 5.2,
    avgRentPsf: 32.00, rentGrowth: 2.0, absorptionSf: 65000,
    inventorySf: 6200000, trend: "stable", transactionCount: 6 },

  // ── Multifamily ──────────────────────────────────────────────────────
  { submarket: "Inner Loop", submarketId: "inner-loop-mf", propertyType: "multifamily",
    avgCapRate: 5.2, capRateRange: "4.5 - 5.8", vacancyRate: 6.5,
    avgRentPsf: 2.50, rentGrowth: 4.2, absorptionSf: null,
    inventorySf: null, trend: "up", transactionCount: 25 },
  { submarket: "Medical Center", submarketId: "medical-center-mf", propertyType: "multifamily",
    avgCapRate: 5.5, capRateRange: "4.8 - 6.2", vacancyRate: 7.2,
    avgRentPsf: 2.20, rentGrowth: 3.5, absorptionSf: null,
    inventorySf: null, trend: "up", transactionCount: 18 },
  { submarket: "Katy", submarketId: "katy-mf", propertyType: "multifamily",
    avgCapRate: 5.8, capRateRange: "5.0 - 6.5", vacancyRate: 8.0,
    avgRentPsf: 1.85, rentGrowth: 2.8, absorptionSf: null,
    inventorySf: null, trend: "stable", transactionCount: 14 },
  { submarket: "Conroe / The Woodlands", submarketId: "conroe-mf", propertyType: "multifamily",
    avgCapRate: 6.0, capRateRange: "5.2 - 6.8", vacancyRate: 7.5,
    avgRentPsf: 1.75, rentGrowth: 3.0, absorptionSf: null,
    inventorySf: null, trend: "up", transactionCount: 10 },
];

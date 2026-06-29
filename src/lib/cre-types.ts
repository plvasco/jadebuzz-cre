// ── CRE Property Types ─────────────────────────────────────────────────

export type PropertyType = "office" | "retail" | "industrial" | "multifamily";

export const PROPERTY_TYPES: { value: string; label: string; icon: string }[] = [
  { value: "all", label: "All Types", icon: "🏢" },
  { value: "office", label: "Office", icon: "🏢" },
  { value: "retail", label: "Retail", icon: "🏬" },
  { value: "industrial", label: "Industrial", icon: "🏭" },
  { value: "multifamily", label: "Multifamily", icon: "🏠" },
];

// ── Houston Commercial Submarkets ───────────────────────────────────────

export interface CreSubmarket {
  id: string;
  name: string;
  propertyTypes: PropertyType[];
  description: string;
}

export const SUBMARKETS: CreSubmarket[] = [
  // Office
  { id: "cbd", name: "CBD / Downtown", propertyTypes: ["office"], description: "Central Business District" },
  { id: "galleria", name: "Galleria / Uptown", propertyTypes: ["office", "retail"], description: "West Loop, Post Oak" },
  { id: "energy-corridor", name: "Energy Corridor", propertyTypes: ["office"], description: "I-10 West / Memorial" },
  { id: "katy-freeway", name: "Katy Freeway", propertyTypes: ["office", "retail"], description: "I-10 West corridor" },
  { id: "westchase", name: "Westchase", propertyTypes: ["office", "industrial"], description: "Beltway 8 / Westpark" },
  { id: "greenway", name: "Greenway Plaza", propertyTypes: ["office"], description: "Southwest Freeway" },
  { id: "woodlands", name: "The Woodlands", propertyTypes: ["office", "retail", "industrial"], description: "North (Montgomery Co)" },
  { id: "sugar-land", name: "Sugar Land", propertyTypes: ["office", "retail", "industrial"], description: "Southwest (Fort Bend)" },
  { id: "medical-center", name: "Medical Center", propertyTypes: ["office"], description: "Texas Medical Center" },
  { id: "greenspoint", name: "North Belt / Greenspoint", propertyTypes: ["office", "industrial"], description: "I-45 North" },
  // Industrial
  { id: "nw-industrial", name: "Northwest Industrial", propertyTypes: ["industrial"], description: "290 / Hempstead corridor" },
  { id: "se-industrial", name: "Southeast Industrial", propertyTypes: ["industrial"], description: "Bayport / La Porte" },
  { id: "east-industrial", name: "East Houston Logistics", propertyTypes: ["industrial"], description: "Port / I-10 East" },
  // Retail
  { id: "inner-loop", name: "Inner Loop Retail", propertyTypes: ["retail", "multifamily"], description: "Heights, Montrose, Midtown" },
  { id: "town-square", name: "Sugar Land Town Square", propertyTypes: ["retail", "multifamily"], description: "Mixed-use lifestyle center" },
  { id: "woodlands-retail", name: "The Woodlands Retail", propertyTypes: ["retail"], description: "Regional mall, lifestyle centers" },
  // Multifamily
  { id: "inner-loop-mf", name: "Inner Loop Multifamily", propertyTypes: ["multifamily"], description: "Heights, Montrose, EaDo" },
  { id: "medical-center-mf", name: "Medical Center MF", propertyTypes: ["multifamily"], description: "Around TMC" },
  { id: "katy-mf", name: "Katy Multifamily", propertyTypes: ["multifamily"], description: "Katy / Cinco Ranch" },
  { id: "conroe-mf", name: "Conroe / Woodlands MF", propertyTypes: ["multifamily"], description: "North Houston" },
];

// ── Commercial Property Listing ─────────────────────────────────────────

export interface CreListing {
  id: string;
  propertyType: PropertyType;
  submarket: string;
  address: string;
  price: number | null;          // Sale price
  pricePsf: number | null;       // Price per square foot
  capRate: number | null;        // Cap rate (%)
  noi: number | null;            // Net Operating Income ($)
  nnnRent: number | null;        // NNN rent ($/sf/year)
  rentPsfMo: number | null;      // Rent per sf per month
  buildingSf: number | null;     // Building square footage
  lotSf: number | null;          // Lot square footage
  yearBuilt: number | null;
  occupancy: number | null;      // Occupancy rate (%)
  vacancy: number | null;        // Vacancy rate (%)
  leaseType: "nnn" | "nn" | "gross" | null;
  status: "for-sale" | "for-lease" | "sold" | "leased";
  daysOnMarket: number | null;
  tenant: string | null;
  source: string;                // "Crexi", "County Clerk", "Broker Report"
  dateAdded: string;
}

// ── Submarket Summary (from broker reports) ────────────────────────────

export interface CreMarketSummary {
  submarketId: string;
  propertyType: PropertyType;
  quarter: string;               // e.g. "Q2 2026"
  avgCapRate: number | null;
  vacancyRate: number | null;
  avgRentPsf: number | null;     // $/sf/year NNN
  absorption: number | null;     // Net absorption in SF
  inventorySf: number | null;    // Total inventory SF
  source: string;
}

// ── Sample Data ─────────────────────────────────────────────────────────

export const SAMPLE_LISTINGS: CreListing[] = [
  {
    id: "cre-001", propertyType: "office" as PropertyType, submarket: "galleria",
    address: "1230 Post Oak Blvd, Houston, TX 77056",
    price: 8500000, pricePsf: 250, capRate: 6.8, noi: 578000,
    nnnRent: 28.50, rentPsfMo: 2.38, buildingSf: 34000, lotSf: null, yearBuilt: 1985,
    occupancy: 85, vacancy: 15, tenant: null, leaseType: "nnn" as const, status: "for-sale" as const,
    daysOnMarket: 45, source: "Crexi", dateAdded: "2026-06-28",
  },
  {
    id: "cre-002", propertyType: "retail" as PropertyType, submarket: "katy-freeway",
    address: "20445 Katy Fwy, Houston, TX 77094",
    price: 3200000, pricePsf: 320, capRate: 7.2, noi: 230400,
    nnnRent: 32.00, rentPsfMo: 2.67, buildingSf: 10000, lotSf: null, yearBuilt: 2010,
    occupancy: 100, vacancy: 0, tenant: "Walgreens", leaseType: "nnn" as const, status: "for-sale" as const,
    daysOnMarket: 30, source: "Crexi", dateAdded: "2026-06-27",
  },
  {
    id: "cre-003", propertyType: "industrial" as PropertyType, submarket: "nw-industrial",
    address: "15300 Hempstead Rd, Houston, TX 77040",
    price: 4800000, pricePsf: 120, capRate: 7.8, noi: 374400,
    nnnRent: 9.60, rentPsfMo: 0.80, buildingSf: 40000, lotSf: null, yearBuilt: 1998,
    occupancy: 90, vacancy: 10, tenant: null, leaseType: "nnn" as const, status: "for-sale" as const,
    daysOnMarket: 60, source: "Crexi", dateAdded: "2026-06-25",
  },
  {
    id: "cre-004", propertyType: "multifamily" as PropertyType, submarket: "inner-loop-mf",
    address: "2015 Main St, Houston, TX 77002",
    price: 12000000, pricePsf: 300, capRate: 5.5, noi: 660000,
    nnnRent: null, rentPsfMo: 2.50, buildingSf: 40000, lotSf: null, yearBuilt: 2005,
    occupancy: 92, vacancy: 8, tenant: null, leaseType: "gross" as const, status: "for-sale" as const,
    daysOnMarket: 20, source: "Crexi", dateAdded: "2026-06-29",
  },
];

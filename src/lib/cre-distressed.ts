// ── Commercial Distressed / CRE Foreclosure Data ──────────────────────

export interface CreDistressedProperty {
  id: string;
  propertyType: "office" | "retail" | "industrial" | "multifamily" | "land" | "other";
  submarket: string;
  address: string;
  distressType: "foreclosure" | "note-sale" | "reo" | "tax-delinquent" | "motivated-seller";
  status: string;
  estimatedValue: number | null;
  loanAmount: number | null;
  bidAmount: number | null;       // Starting bid at auction
  buildingSf: number | null;
  lotSf: number | null;
  yearBuilt: number | null;
  occupancy: number | null;
  capRate: number | null;         // Pro forma
  noi: number | null;
  auctionDate: string | null;
  lender: string | null;
  ownerName: string | null;
  score: number | null;            // 0-100 opportunity score
  source: string;
  dateAdded: string;
  notes: string;
}

export const DISTRESS_TYPES = [
  { value: "all", label: "All Types", icon: "⚠️" },
  { value: "foreclosure", label: "Foreclosure", icon: "🔴" },
  { value: "note-sale", label: "Note Sale", icon: "📄" },
  { value: "reo", label: "REO / Bank-Owned", icon: "🏦" },
  { value: "tax-delinquent", label: "Tax Delinquent", icon: "💰" },
  { value: "motivated-seller", label: "Motivated Seller", icon: "🏃" },
];

export const SAMPLE_DISTRESSED: CreDistressedProperty[] = [
  {
    id: "cd-001", propertyType: "office", submarket: "greenspoint",
    address: "12100 Greenspoint Dr, Houston, TX 77060",
    distressType: "foreclosure",
    status: "Trustee Sale — May 5, 2026",
    estimatedValue: 2800000, loanAmount: 4200000, bidAmount: 1800000,
    buildingSf: 45000, lotSf: null, yearBuilt: 1982, occupancy: 35,
    capRate: null, noi: 98000,
    auctionDate: "2026-07-07",
    lender: "Bank OZK",
    ownerName: "Greenspoint Office Partners LP",
    score: 72, source: "Harris County Clerk",
    dateAdded: "2026-06-20", notes: "Value-add opportunity. Need $800K in capex. Vacancy driven by deferred maintenance.",
  },
  {
    id: "cd-002", propertyType: "retail", submarket: "sugar-land",
    address: "3200 Hwy 6, Sugar Land, TX 77478",
    distressType: "note-sale",
    status: "Note Sale — $1.8M UPB",
    estimatedValue: 2200000, loanAmount: 1800000, bidAmount: null,
    buildingSf: 12000, lotSf: null, yearBuilt: 1995, occupancy: 72,
    capRate: 6.2, noi: 136000,
    auctionDate: null,
    lender: "First Horizon Bank",
    ownerName: "Sugar Land Retail LLC",
    score: 78, source: "Loan Sale Advisor",
    dateAdded: "2026-06-22", notes: "Credit tenant (Walgreens). Below-market rent. Mark-to-market opportunity.",
  },
  {
    id: "cd-003", propertyType: "industrial", submarket: "nw-industrial",
    address: "16700 Hempstead Rd, Houston, TX 77040",
    distressType: "reo",
    status: "REO — Bank-Owned",
    estimatedValue: 3400000, loanAmount: 4200000, bidAmount: null,
    buildingSf: 52000, lotSf: 3.2, yearBuilt: 1998, occupancy: 60,
    capRate: 5.8, noi: 197000,
    auctionDate: null,
    lender: "Comerica Bank",
    ownerName: "NW Industrial Properties LLC",
    score: 68, source: "Crexi",
    dateAdded: "2026-06-15", notes: "Partially leased. 30K SF vacant. Good bones, needs leasing effort. Location is strong — 290 visibility.",
  },
  {
    id: "cd-004", propertyType: "multifamily", submarket: "inner-loop-mf",
    address: "3400 Lyons Ave, Houston, TX 77020",
    distressType: "tax-delinquent",
    status: "Tax Delinquent — $340K owed",
    estimatedValue: 4800000, loanAmount: 3200000, bidAmount: null,
    buildingSf: 36000, lotSf: null, yearBuilt: 1975, occupancy: 82,
    capRate: null, noi: null,
    auctionDate: null,
    lender: "HUD",
    ownerName: "Lyons Garden Apartments LP",
    score: 82, source: "Harris County Tax Office",
    dateAdded: "2026-06-25", notes: "48-unit garden style. Tax foreclosure risk. Good value play for operator — below replacement cost PSF.",
  },
  {
    id: "cd-005", propertyType: "office", submarket: "westchase",
    address: "10550 Westpark Dr, Houston, TX 77042",
    distressType: "foreclosure",
    status: "Foreclosure — Court Confirmed",
    estimatedValue: 1900000, loanAmount: 3100000, bidAmount: 1400000,
    buildingSf: 28000, lotSf: null, yearBuilt: 1980, occupancy: 45,
    capRate: null, noi: 65000,
    auctionDate: "2026-06-30",
    lender: "Texas Capital Bank",
    ownerName: "Westpark Office Holdings LLC",
    score: 75, source: "Harris County Clerk",
    dateAdded: "2026-06-18", notes: "Small office, great location near Beltway 8. Low occupancy = value-add. Need $500K in TI/leasing commissions.",
  },
  {
    id: "cd-006", propertyType: "retail", submarket: "east-industrial",
    address: "8200 Wallisville Rd, Houston, TX 77029",
    distressType: "motivated-seller",
    status: "Price Reduced — $2.1M",
    estimatedValue: 2800000, loanAmount: null, bidAmount: null,
    buildingSf: 8500, lotSf: null, yearBuilt: 2015, occupancy: 100,
    capRate: 7.0, noi: 196000,
    auctionDate: null,
    lender: null,
    ownerName: "Wallisville Holdings LLC",
    score: 85, source: "Crexi",
    dateAdded: "2026-06-28", notes: "NNN lease to O'Reilly Auto Parts. 10 years remaining. Absolute NNN. Price dropped $700K — 7% cap on credit tenant is strong.",
  },
  {
    id: "cd-007", propertyType: "industrial", submarket: "se-industrial",
    address: "9500 Port Rd, La Porte, TX 77571",
    distressType: "foreclosure",
    status: "Trustee Sale — August 3, 2026",
    estimatedValue: 5600000, loanAmount: 7800000, bidAmount: 3800000,
    buildingSf: 85000, lotSf: 8.5, yearBuilt: 2005, occupancy: 55,
    capRate: null, noi: 210000,
    auctionDate: "2026-08-03",
    lender: "Cadence Bank",
    ownerName: "Port Logistics LLC",
    score: 70, source: "Harris County Clerk",
    dateAdded: "2026-06-21", notes: "Heavy industrial near Port of Houston. Rail-served. High vacancy but strategic location. Environmental due diligence needed.",
  },
  {
    id: "cd-008", propertyType: "multifamily", submarket: "katy-mf",
    address: "2100 Katy Mills Blvd, Katy, TX 77494",
    distressType: "note-sale",
    status: "Performing Note — $5.2M UPB",
    estimatedValue: 7200000, loanAmount: 5200000, bidAmount: null,
    buildingSf: 62000, lotSf: null, yearBuilt: 2008, occupancy: 88,
    capRate: 5.5, noi: 396000,
    auctionDate: null,
    lender: "Veritex Community Bank",
    ownerName: "Katy Residential Partners Ltd",
    score: 65, source: "Loan Sale Advisor",
    dateAdded: "2026-06-24", notes: "Performing note, not distressed yet. 5.5% cap on solid asset in growth corridor. Available at discount for quick close.",
  },
];

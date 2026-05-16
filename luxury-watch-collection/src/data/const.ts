// ─── App Identity ────────────────────────────────────────────────────────────
export const APP_TITLE = "Prestige Collection";
export const APP_TAGLINE = "Private Watch Rental";

// ─── User Roles ───────────────────────────────────────────────────────────────
export type UserRole = "owner" | "member";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin?: string; // hashed
}

// Ken = owner (full access), Travis & Preston = member (reserve/rent only)
export const USERS: User[] = [
  { id: "ken", name: "Ken", role: "owner", pin: "0000" },       // default PIN, must change
  { id: "travis", name: "Travis", role: "member", pin: "1111" },
  { id: "preston", name: "Preston", role: "member", pin: "2222" },
];

// ─── Watch Data ───────────────────────────────────────────────────────────────
export interface Watch {
  id: string;
  name: string;
  brand: string;
  model: string;
  reference: string;
  description: string;
  imageUrl: string;      // Google Photos / iCloud shared link
  backImageUrl?: string; // optional back of watch
  dailyRate: number;     // in USD cents (e.g. 200 = $2.00)
  available: boolean;
  year?: string;
  movement?: string;
  caseSize?: string;
  waterResistance?: string;
  condition?: string;
  createdAt: string;
}

export const SAMPLE_WATCHES: Watch[] = [
  {
    id: "1",
    name: "Nautilus",
    brand: "Patek Philippe",
    model: "5711/1A-010",
    reference: "5711/1A-010",
    description: "The iconic Patek Philippe Nautilus with its distinctive porthole design. Blue gradient dial, 40mm stainless steel case. One of the most sought-after watches in the world.",
    imageUrl: "",
    dailyRate: 500,
    available: true,
    year: "2021",
    movement: "Automatic",
    caseSize: "40mm",
    waterResistance: "120m",
    condition: "Excellent",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Submariner Date",
    brand: "Rolex",
    model: "126610LN",
    reference: "126610LN",
    description: "Rolex Submariner Date in Oystersteel with a black Cerachrom bezel insert and a black dial. The benchmark diving watch since 1953.",
    imageUrl: "",
    dailyRate: 300,
    available: true,
    year: "2023",
    movement: "Automatic",
    caseSize: "41mm",
    waterResistance: "300m",
    condition: "Like New",
    createdAt: "2026-02-20",
  },
  {
    id: "3",
    name: "Luminor Marina",
    brand: "Panerai",
    model: "PAM01313",
    reference: "PAM01313",
    description: "Panerai Luminor Marina with the iconic crown-protecting device. Blue dial version with 44mm steel case and leather strap. Bold Italian design with Swiss precision.",
    imageUrl: "",
    dailyRate: 200,
    available: false,
    year: "2022",
    movement: "Automatic",
    caseSize: "44mm",
    waterResistance: "300m",
    condition: "Very Good",
    createdAt: "2026-01-28",
  },
  {
    id: "4",
    name: "Royal Oak",
    brand: "Audemars Piguet",
    model: "15500ST",
    reference: "15500ST.OO.1220ST.01",
    description: "The Audemars Piguet Royal Oak Jumbo in stainless steel. The watch that started the luxury steel sports watch revolution. 'Tapisserie' Grande Tapisserie blue dial.",
    imageUrl: "",
    dailyRate: 450,
    available: true,
    year: "2022",
    movement: "Automatic",
    caseSize: "41mm",
    waterResistance: "50m",
    condition: "Excellent",
    createdAt: "2026-03-01",
  },
  {
    id: "5",
    name: "Speedmaster Moonwatch",
    brand: "Omega",
    model: "310.30.42.50.01.001",
    reference: "Moonwatch Professional",
    description: "Omega Speedmaster Professional — the legendary Moonwatch worn on the lunar surface. Hesalite crystal, manual-wind movement. A piece of space exploration history.",
    imageUrl: "",
    dailyRate: 150,
    available: true,
    year: "2024",
    movement: "Manual Wind",
    caseSize: "42mm",
    waterResistance: "50m",
    condition: "Like New",
    createdAt: "2026-02-10",
  },
];

// ─── Reservations ─────────────────────────────────────────────────────────────
export interface Reservation {
  id: string;
  watchId: string;
  borrowerId: string;    // user id
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  status: "active" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  WATCHES: "pwc_watches",
  RESERVATIONS: "pwc_reservations",
  CURRENT_USER: "pwc_current_user",
  IS_SETUP_COMPLETE: "pwc_setup_complete",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function isWithinDates(start: string, end: string, checkDate: string): boolean {
  const d = new Date(checkDate);
  return d >= new Date(start) && d <= new Date(end);
}
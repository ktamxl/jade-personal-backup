import { drizzle } from "drizzle-orm/mysql2";
import { watches } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const sampleWatches = [
  {
    name: "Submariner Date",
    brand: "Rolex",
    model: "126610LN",
    description: "The iconic Rolex Submariner Date in stainless steel with black dial and ceramic bezel. A legendary dive watch combining elegance and functionality.",
    imageUrl: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&h=800&fit=crop",
    caseSize: "41mm",
    movement: "Automatic",
    waterResistance: "300m",
    material: "Stainless Steel",
    available: true,
    dailyRate: 200,
  },
  {
    name: "Speedmaster Professional",
    brand: "Omega",
    model: "Moonwatch",
    description: "The legendary Omega Speedmaster Professional, the first watch worn on the moon. Manual-wind chronograph with hesalite crystal.",
    imageUrl: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=800&fit=crop",
    caseSize: "42mm",
    movement: "Manual",
    waterResistance: "50m",
    material: "Stainless Steel",
    available: true,
    dailyRate: 200,
  },
  {
    name: "Royal Oak",
    brand: "Audemars Piguet",
    model: "15500ST",
    description: "The iconic Audemars Piguet Royal Oak with its distinctive octagonal bezel and integrated bracelet. A true icon of luxury sports watches.",
    imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=800&fit=crop",
    caseSize: "41mm",
    movement: "Automatic",
    waterResistance: "50m",
    material: "Stainless Steel",
    available: true,
    dailyRate: 200,
  },
  {
    name: "Nautilus",
    brand: "Patek Philippe",
    model: "5711/1A",
    description: "The legendary Patek Philippe Nautilus, one of the most sought-after luxury sports watches. Features the iconic porthole design.",
    imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=800&fit=crop",
    caseSize: "40mm",
    movement: "Automatic",
    waterResistance: "120m",
    material: "Stainless Steel",
    available: true,
    dailyRate: 200,
  },
  {
    name: "Daytona",
    brand: "Rolex",
    model: "116500LN",
    description: "The iconic Rolex Cosmograph Daytona chronograph. A legendary racing watch with ceramic bezel and black dial.",
    imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&h=800&fit=crop",
    caseSize: "40mm",
    movement: "Automatic",
    waterResistance: "100m",
    material: "Stainless Steel",
    available: true,
    dailyRate: 200,
  },
  {
    name: "Big Bang",
    brand: "Hublot",
    model: "Classic Fusion",
    description: "The bold Hublot Big Bang with its fusion of materials and contemporary design. A statement piece for the modern collector.",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&h=800&fit=crop",
    caseSize: "45mm",
    movement: "Automatic",
    waterResistance: "100m",
    material: "Titanium",
    available: true,
    dailyRate: 200,
  },
];

async function seed() {
  console.log("Seeding watches...");
  
  for (const watch of sampleWatches) {
    await db.insert(watches).values(watch);
    console.log(`Added: ${watch.brand} ${watch.name}`);
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});

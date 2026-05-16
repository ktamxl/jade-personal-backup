import { drizzle } from "drizzle-orm/mysql2";
import { rentals, invoices, reviews } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function createTestData() {
  console.log("Creating test completed rental...");
  
  // Create a completed rental for watch ID 1 (Submariner) for user ID 1
  const startDate = new Date("2024-11-01");
  const endDate = new Date("2024-11-05");
  const totalCost = 5 * 200; // 5 days * $2.00
  
  const rentalResult = await db.insert(rentals).values({
    watchId: 1,
    userId: 1,
    startDate,
    endDate,
    totalCost,
    status: "completed",
  });
  
  console.log("Created completed rental");
  
  // Create corresponding invoice
  await db.insert(invoices).values({
    rentalId: 1,
    userId: 1,
    amount: totalCost,
    status: "paid",
  });
  
  console.log("Created invoice");
  
  // Create a sample review
  await db.insert(reviews).values({
    watchId: 1,
    userId: 1,
    rentalId: 1,
    rating: 5,
    comment: "Absolutely stunning timepiece! The Submariner exceeded all expectations. Perfect weight, impeccable craftsmanship, and incredibly comfortable to wear.",
  });
  
  console.log("Created sample review");
  console.log("Test data created successfully!");
}

createTestData().catch(console.error);

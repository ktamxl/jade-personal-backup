import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, watches, rentals, invoices, reviews, InsertWatch, InsertRental, InsertInvoice, InsertReview } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Watch management
export async function getAllWatches() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(watches).orderBy(desc(watches.createdAt));
}

export async function getWatchById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(watches).where(eq(watches.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createWatch(watch: InsertWatch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(watches).values(watch);
}

export async function updateWatch(id: number, data: Partial<InsertWatch>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(watches).set(data).where(eq(watches.id, id));
}

export async function deleteWatch(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(watches).where(eq(watches.id, id));
}

// Rental management
export async function getRentalsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(rentals).where(eq(rentals.userId, userId)).orderBy(desc(rentals.createdAt));
}

export async function getActiveRentalsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(rentals)
    .where(and(
      eq(rentals.userId, userId),
      eq(rentals.status, "active")
    ))
    .orderBy(desc(rentals.createdAt));
}

export async function getRentalById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(rentals).where(eq(rentals.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createRental(rental: InsertRental) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(rentals).values(rental);
  return result;
}

export async function updateRental(id: number, data: Partial<InsertRental>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(rentals).set(data).where(eq(rentals.id, id));
}

// Check if watch is available for rental period
export async function isWatchAvailable(watchId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return false;
  
  const conflictingRentals = await db.select().from(rentals)
    .where(and(
      eq(rentals.watchId, watchId),
      eq(rentals.status, "active")
    ));
  
  // Check for date overlaps
  for (const rental of conflictingRentals) {
    const rentalStart = new Date(rental.startDate);
    const rentalEnd = new Date(rental.endDate);
    
    if (
      (startDate >= rentalStart && startDate <= rentalEnd) ||
      (endDate >= rentalStart && endDate <= rentalEnd) ||
      (startDate <= rentalStart && endDate >= rentalEnd)
    ) {
      return false;
    }
  }
  
  return true;
}

// Invoice management
export async function getInvoicesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt));
}

export async function createInvoice(invoice: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(invoices).values(invoice);
}

export async function updateInvoice(id: number, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(invoices).set(data).where(eq(invoices.id, id));
}

// Review management
export async function getReviewsByWatchId(watchId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reviews).where(eq(reviews.watchId, watchId)).orderBy(desc(reviews.createdAt));
}

export async function getReviewByRentalId(rentalId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(reviews).where(eq(reviews.rentalId, rentalId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reviews).values(review);
}

export async function getAverageRating(watchId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const watchReviews = await db.select().from(reviews).where(eq(reviews.watchId, watchId));
  
  if (watchReviews.length === 0) return 0;
  
  const sum = watchReviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / watchReviews.length;
}

// Admin functions
export async function getAllRentals() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rentals);
}

export async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(invoices);
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(users);
  // Return first name only for privacy
  return rows.map(u => ({
    ...u,
    name: u.name ? u.name.trim().split(/\s+/)[0] : u.name,
  }));
}

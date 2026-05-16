import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Watches table - stores luxury watch information
 */
export const watches = mysqlTable("watches", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  backImageUrl: varchar("backImageUrl", { length: 500 }),
  caseSize: varchar("caseSize", { length: 50 }),
  movement: varchar("movement", { length: 100 }),
  waterResistance: varchar("waterResistance", { length: 50 }),
  material: varchar("material", { length: 100 }),
  available: boolean("available").default(true).notNull(),
  dailyRate: int("dailyRate").default(200).notNull(), // stored in cents ($2.00 = 200)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Watch = typeof watches.$inferSelect;
export type InsertWatch = typeof watches.$inferInsert;

/**
 * Rentals table - tracks watch rentals
 */
export const rentals = mysqlTable("rentals", {
  id: int("id").autoincrement().primaryKey(),
  watchId: int("watchId").notNull(),
  userId: int("userId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending").notNull(),
  totalCost: int("totalCost").notNull(), // stored in cents
  paymentReceived: boolean("paymentReceived").default(false).notNull(),
  notes: text("notes"),
  activatedAt: timestamp("activatedAt"),
  completedAt: timestamp("completedAt"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rental = typeof rentals.$inferSelect;
export type InsertRental = typeof rentals.$inferInsert;

/**
 * Invoices table - billing records
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  rentalId: int("rentalId").notNull(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // stored in cents
  status: mysqlEnum("status", ["pending", "paid", "overdue"]).default("pending").notNull(),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Reviews table - user ratings and reviews for watches
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  watchId: int("watchId").notNull(),
  userId: int("userId").notNull(),
  rentalId: int("rentalId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  photoUrl: varchar("photoUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Product Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  originalPrice: doublePrecision("original_price"),
  imageUrl: text("image_url").notNull(),
  condition: text("condition").notNull(), // "new", "refurbished", "used"
  categoryId: integer("category_id").notNull(),
  marketplace: text("marketplace"), // "amazon", "ebay", "direct"
  marketplaceId: text("marketplace_id"),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  stock: integer("stock").default(0),
  brand: text("brand").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Inventory Table
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
});

// User Table for Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Extended user schema that includes isAdmin for internal use
export const insertUserWithAdminSchema = insertUserSchema.extend({
  isAdmin: z.boolean().default(false),
});

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserWithAdmin = z.infer<typeof insertUserWithAdminSchema>;

// Custom validation schemas for frontend
export const productConditions = ["new", "refurbished", "used"] as const;
export const marketplaces = ["amazon", "ebay", "direct"] as const;

export const productValidationSchema = insertProductSchema.extend({
  condition: z.enum(productConditions),
  marketplace: z.enum(marketplaces).optional(),
});

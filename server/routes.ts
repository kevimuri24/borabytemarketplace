import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertProductSchema,
  insertCategorySchema,
  productConditions,
  marketplaces,
} from "@shared/schema";

// Validation error handling
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // === CATEGORY ROUTES ===
  
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by ID or slug
  app.get("/api/categories/:identifier", async (req: Request, res: Response) => {
    try {
      const { identifier } = req.params;
      let category;

      if (/^\d+$/.test(identifier)) {
        // If identifier is a number, find by ID
        category = await storage.getCategoryById(parseInt(identifier, 10));
      } else {
        // Otherwise, find by slug
        category = await storage.getCategoryBySlug(identifier);
      }

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Create new category
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message 
        });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // === PRODUCT ROUTES ===
  
  // Get all products with filtering
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      // Build filters from query params
      const filters: any = {};
      
      if (req.query.categoryId) {
        filters.categoryId = parseInt(req.query.categoryId as string, 10);
      }
      
      if (req.query.condition) {
        const conditions = Array.isArray(req.query.condition) 
          ? req.query.condition as string[] 
          : [req.query.condition as string];
        filters.condition = conditions.filter(c => productConditions.includes(c as any));
      }
      
      if (req.query.marketplace) {
        const mps = Array.isArray(req.query.marketplace) 
          ? req.query.marketplace as string[] 
          : [req.query.marketplace as string];
        filters.marketplaces = mps.filter(m => marketplaces.includes(m as any));
      }
      
      if (req.query.minPrice || req.query.maxPrice) {
        filters.priceRange = {};
        if (req.query.minPrice) {
          filters.priceRange.min = parseFloat(req.query.minPrice as string);
        }
        if (req.query.maxPrice) {
          filters.priceRange.max = parseFloat(req.query.maxPrice as string);
        }
      }
      
      if (req.query.brand) {
        const brands = Array.isArray(req.query.brand) 
          ? req.query.brand as string[] 
          : [req.query.brand as string];
        filters.brand = brands;
      }
      
      if (req.query.search) {
        filters.search = req.query.search as string;
      }
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get inventory information
      const inventory = await storage.getInventory(id);
      
      res.json({
        ...product,
        inventoryDetails: inventory || { quantity: 0, lastUpdated: new Date() }
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create new product
  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message 
        });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product
  app.patch("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Partially validate update data
      const updateSchema = insertProductSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProduct(id, validatedData);
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message 
        });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // === INVENTORY ROUTES ===
  
  // Get product inventory
  app.get("/api/inventory/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId, 10);
      const inventory = await storage.getInventory(productId);
      
      if (!inventory) {
        return res.status(404).json({ message: "Inventory not found" });
      }
      
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  // Update product inventory
  app.patch("/api/inventory/:productId", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId, 10);
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const quantitySchema = z.object({ quantity: z.number().int().min(0) });
      const { quantity } = quantitySchema.parse(req.body);
      
      const updatedInventory = await storage.updateInventory(productId, quantity);
      res.json(updatedInventory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: fromZodError(error).message 
        });
      }
      console.error("Error updating inventory:", error);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });

  // === MARKETPLACE INTEGRATION ROUTES ===
  
  // These would connect to actual Amazon/eBay APIs in a real implementation
  // For now we'll create mock endpoints for the frontend to consume
  
  app.get("/api/marketplace/amazon/status", async (_req: Request, res: Response) => {
    res.json({
      connected: true,
      productsSynced: 1243,
      lastSync: new Date(),
      syncStatus: "up-to-date"
    });
  });
  
  app.get("/api/marketplace/ebay/status", async (_req: Request, res: Response) => {
    res.json({
      connected: true,
      productsSynced: 876,
      lastSync: new Date(),
      syncStatus: "updates-available"
    });
  });

  // === CHATBOT ENDPOINT ===
  
  // Simple chatbot endpoint that returns predefined responses
  app.post("/api/chatbot/message", async (req: Request, res: Response) => {
    try {
      const messageSchema = z.object({ message: z.string().min(1) });
      const { message } = messageSchema.parse(req.body);
      
      // Simple keyword-based responses
      let response: string;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        response = "Hello! Welcome to Borabyte. How can I help you today?";
      } else if (lowerMessage.includes("laptop") || lowerMessage.includes("computer")) {
        response = "We have a great selection of laptops in new, refurbished, and used conditions. Would you like me to recommend some based on your budget?";
      } else if (lowerMessage.includes("phone") || lowerMessage.includes("smartphone")) {
        response = "I'd be happy to help you find a smartphone. We carry all major brands including Apple, Samsung, and Google. Do you have a specific brand in mind?";
      } else if (lowerMessage.includes("headphone") || lowerMessage.includes("audio")) {
        response = "Our headphone collection includes noise-cancelling, wireless, and gaming options from brands like Sony, Bose, and Apple.";
      } else if (lowerMessage.includes("refurbished")) {
        response = "Our refurbished products are thoroughly tested and come with a 90-day warranty. They're a great way to save money while still getting quality electronics.";
      } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
        response = "We offer competitive pricing across all conditions. New items come with full manufacturer warranties, refurbished items have a 90-day warranty, and used items are priced based on condition.";
      } else if (lowerMessage.includes("warranty")) {
        response = "New products come with full manufacturer warranties. Refurbished products include a 90-day warranty. Used products have a 30-day return policy for any functional issues.";
      } else if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
        response = "We offer a 30-day return policy on all products. If you're not satisfied, you can return the item for a full refund or exchange.";
      } else {
        response = "I'm here to help with any questions about our electronics. You can ask about specific products, warranties, shipping, returns, or get recommendations based on your needs.";
      }
      
      res.json({ response });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Please provide a valid message" });
      }
      console.error("Error processing chatbot message:", error);
      res.status(500).json({ message: "Failed to process your message" });
    }
  });

  return httpServer;
}

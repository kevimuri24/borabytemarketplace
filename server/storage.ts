import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  inventory, type Inventory, type InsertInventory
} from "@shared/schema";

// Storage interface for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: {
    categoryId?: number;
    condition?: string[];
    marketplaces?: string[];
    priceRange?: { min?: number; max?: number };
    brand?: string[];
    search?: string;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Inventory operations
  getInventory(productId: number): Promise<Inventory | undefined>;
  updateInventory(productId: number, quantity: number): Promise<Inventory>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private inventories: Map<number, Inventory>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentInventoryId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.inventories = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentInventoryId = 1;
    
    // Initialize with sample categories
    this.initializeCategories();
  }

  private initializeCategories() {
    const initialCategories: InsertCategory[] = [
      { name: "Laptops", slug: "laptops", icon: "fas fa-laptop" },
      { name: "Smartphones", slug: "smartphones", icon: "fas fa-mobile-alt" },
      { name: "Tablets", slug: "tablets", icon: "fas fa-tablet-alt" },
      { name: "Headphones", slug: "headphones", icon: "fas fa-headphones" },
      { name: "TVs", slug: "tvs", icon: "fas fa-tv" },
      { name: "Gaming", slug: "gaming", icon: "fas fa-gamepad" },
    ];
    
    initialCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getProducts(filters?: {
    categoryId?: number;
    condition?: string[];
    marketplaces?: string[];
    priceRange?: { min?: number; max?: number };
    brand?: string[];
    search?: string;
  }): Promise<Product[]> {
    let filteredProducts = Array.from(this.products.values());
    
    if (filters) {
      if (filters.categoryId !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
      }
      
      if (filters.condition && filters.condition.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.condition!.includes(p.condition));
      }
      
      if (filters.marketplaces && filters.marketplaces.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.marketplace && filters.marketplaces!.includes(p.marketplace));
      }
      
      if (filters.priceRange) {
        if (filters.priceRange.min !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= filters.priceRange!.min!);
        }
        if (filters.priceRange.max !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= filters.priceRange!.max!);
        }
      }
      
      if (filters.brand && filters.brand.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.brand!.includes(p.brand));
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.brand.toLowerCase().includes(search)
        );
      }
    }
    
    return filteredProducts;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    
    // Create initial inventory
    if (insertProduct.stock !== undefined) {
      await this.updateInventory(id, insertProduct.stock);
    }
    
    return product;
  }
  
  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const updatedProduct: Product = { ...existingProduct, ...updateData };
    this.products.set(id, updatedProduct);
    
    // Update inventory if stock is provided
    if (updateData.stock !== undefined) {
      await this.updateInventory(id, updateData.stock);
    }
    
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const existed = this.products.has(id);
    this.products.delete(id);
    
    // Delete related inventory
    const inventoryId = Array.from(this.inventories.entries())
      .find(([_, inv]) => inv.productId === id)?.[0];
      
    if (inventoryId) {
      this.inventories.delete(inventoryId);
    }
    
    return existed;
  }
  
  // Inventory operations
  async getInventory(productId: number): Promise<Inventory | undefined> {
    return Array.from(this.inventories.values()).find(
      (inv) => inv.productId === productId,
    );
  }
  
  async updateInventory(productId: number, quantity: number): Promise<Inventory> {
    // Check if inventory exists
    const existingInventory = await this.getInventory(productId);
    
    if (existingInventory) {
      // Update existing inventory
      const updatedInventory: Inventory = {
        ...existingInventory,
        quantity,
        lastUpdated: new Date(),
      };
      this.inventories.set(existingInventory.id, updatedInventory);
      
      // Update product stock
      const product = this.products.get(productId);
      if (product) {
        this.products.set(productId, { ...product, stock: quantity });
      }
      
      return updatedInventory;
    } else {
      // Create new inventory
      const id = this.currentInventoryId++;
      const newInventory: Inventory = {
        id,
        productId,
        quantity,
        lastUpdated: new Date(),
      };
      this.inventories.set(id, newInventory);
      
      // Update product stock
      const product = this.products.get(productId);
      if (product) {
        this.products.set(productId, { ...product, stock: quantity });
      }
      
      return newInventory;
    }
  }
}

// Export a singleton instance
export const storage = new MemStorage();

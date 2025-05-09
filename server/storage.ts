import { 
  users, type User, type InsertUser, type InsertUserWithAdmin,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  inventory, type Inventory, type InsertInventory,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem
} from "@shared/schema";

// Storage interface for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUserWithAdmin | (InsertUser & { isAdmin?: boolean })): Promise<User>;
  
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
  updateInventory(productId: number, quantity: number | null): Promise<Inventory>;
  
  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(userId: number, productId: number): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(userId: number, productId: number, quantity: number): Promise<CartItem>;
  removeCartItem(userId: number, productId: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  updateOrderTracking(id: number, trackingNumber: string): Promise<Order>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private inventories: Map<number, Inventory>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentInventoryId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.inventories = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentInventoryId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with sample categories
    this.initializeCategories();
    
    // Initialize with admin user
    this.initializeAdminUser();
    
    // Initialize sample products
    this.initializeSampleProducts();
  }
  
  private initializeAdminUser() {
    // Add a default admin user
    // Password is 'admin123' (hashed for security)
    // This hash was generated using our hashPassword function with salt
    const adminUser: InsertUser = {
      username: "admin",
      password: "9a7d5573ae799331b30c979262288dabc3e76be65a39dea6f88d8ab4ea6c91c61affe0b91a44c74fd19e9f4ed0d357d9b01e1e37acf4e5a1e5f0294a8c9e6c99.5e9a1ed4d4494e3a7e0b78c7f4a111a0"
    };
    this.createUser({...adminUser, isAdmin: true});
  }
  
  private async initializeSampleProducts() {
    // Get category IDs
    const laptopCategory = await this.getCategoryBySlug('laptops');
    const smartphoneCategory = await this.getCategoryBySlug('smartphones');
    const tabletCategory = await this.getCategoryBySlug('tablets');
    const headphoneCategory = await this.getCategoryBySlug('headphones');
    const tvCategory = await this.getCategoryBySlug('tvs');
    const gamingCategory = await this.getCategoryBySlug('gaming');
    
    if (!laptopCategory || !smartphoneCategory || !tabletCategory || 
        !headphoneCategory || !tvCategory || !gamingCategory) {
      console.error('Failed to initialize products: categories not found');
      return;
    }
    
    // Laptops - various conditions
    const laptops = [
      {
        name: "MacBook Pro 16-inch",
        description: "Apple M2 Pro chip, 16GB RAM, 512GB SSD, 16-inch Liquid Retina XDR display",
        price: 2499.99,
        originalPrice: 2699.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=MacBook+Pro",
        condition: "new",
        categoryId: laptopCategory.id,
        brand: "Apple",
        stock: 15,
        marketplace: "direct",
        rating: 4.8,
        reviewCount: 124
      },
      {
        name: "Dell XPS 15",
        description: "Intel Core i7-12700H, 16GB RAM, 1TB SSD, NVIDIA GeForce RTX 3050Ti",
        price: 1599.99,
        originalPrice: 1899.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Dell+XPS+15",
        condition: "refurbished",
        categoryId: laptopCategory.id,
        brand: "Dell",
        stock: 8,
        marketplace: "amazon",
        marketplaceId: "B0BXR77Z77",
        rating: 4.6,
        reviewCount: 86
      },
      {
        name: "Lenovo ThinkPad X1 Carbon",
        description: "Intel Core i5-1135G7, 8GB RAM, 256GB SSD, 14-inch Full HD display",
        price: 899.99,
        originalPrice: 1299.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=ThinkPad+X1",
        condition: "used",
        categoryId: laptopCategory.id,
        brand: "Lenovo",
        stock: 3,
        marketplace: "ebay",
        marketplaceId: "E8723456",
        rating: 4.2,
        reviewCount: 42
      }
    ];
    
    // Smartphones
    const smartphones = [
      {
        name: "iPhone 15 Pro",
        description: "A17 Pro chip, 6.1-inch Super Retina XDR display, 256GB storage, Triple camera system",
        price: 1099.99,
        originalPrice: null,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=iPhone+15+Pro",
        condition: "new",
        categoryId: smartphoneCategory.id,
        brand: "Apple",
        stock: 25,
        marketplace: "direct",
        rating: 4.9,
        reviewCount: 203
      },
      {
        name: "Samsung Galaxy S23 Ultra",
        description: "Snapdragon 8 Gen 2, 12GB RAM, 256GB storage, 6.8-inch Dynamic AMOLED 2X display, 200MP camera",
        price: 949.99,
        originalPrice: 1199.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Galaxy+S23+Ultra",
        condition: "refurbished",
        categoryId: smartphoneCategory.id,
        brand: "Samsung",
        stock: 12,
        marketplace: "amazon",
        marketplaceId: "B0BZCYT8TQ",
        rating: 4.7,
        reviewCount: 157
      }
    ];
    
    // Tablets
    const tablets = [
      {
        name: "iPad Pro 12.9-inch",
        description: "M2 chip, 12.9-inch Liquid Retina XDR display, 256GB storage, Wi-Fi + Cellular",
        price: 1299.99,
        originalPrice: null,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=iPad+Pro",
        condition: "new",
        categoryId: tabletCategory.id,
        brand: "Apple",
        stock: 18,
        marketplace: "direct",
        rating: 4.8,
        reviewCount: 94
      },
      {
        name: "Samsung Galaxy Tab S9+",
        description: "Snapdragon 8 Gen 2, 12GB RAM, 256GB storage, 12.4-inch Super AMOLED display",
        price: 799.99,
        originalPrice: 999.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Galaxy+Tab+S9",
        condition: "used",
        categoryId: tabletCategory.id,
        brand: "Samsung",
        stock: 5,
        marketplace: "ebay",
        marketplaceId: "E9876543",
        rating: 4.5,
        reviewCount: 38
      }
    ];
    
    // Headphones
    const headphones = [
      {
        name: "Sony WH-1000XM5",
        description: "Wireless noise canceling headphones with 30-hour battery life and LDAC support",
        price: 349.99,
        originalPrice: 399.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Sony+WH-1000XM5",
        condition: "new",
        categoryId: headphoneCategory.id,
        brand: "Sony",
        stock: 22,
        marketplace: "direct",
        rating: 4.9,
        reviewCount: 212
      },
      {
        name: "Apple AirPods Pro (2nd Gen)",
        description: "Active Noise Cancellation, Transparency mode, Spatial Audio, MagSafe charging case",
        price: 189.99,
        originalPrice: 249.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=AirPods+Pro",
        condition: "refurbished",
        categoryId: headphoneCategory.id,
        brand: "Apple",
        stock: 14,
        marketplace: "amazon",
        marketplaceId: "B0BDHB9Y7W",
        rating: 4.7,
        reviewCount: 178
      }
    ];
    
    // TVs
    const tvs = [
      {
        name: "LG C3 65-inch OLED TV",
        description: "4K Smart OLED TV with webOS, Dolby Vision, and G-SYNC compatibility",
        price: 1799.99,
        originalPrice: 2099.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=LG+C3+OLED",
        condition: "new",
        categoryId: tvCategory.id,
        brand: "LG",
        stock: 7,
        marketplace: "direct",
        rating: 4.8,
        reviewCount: 86
      },
      {
        name: "Samsung QN90B 55-inch QLED TV",
        description: "4K Smart QLED TV with Neo Quantum Processor and Anti-Reflection screen",
        price: 999.99,
        originalPrice: 1499.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Samsung+QN90B",
        condition: "refurbished",
        categoryId: tvCategory.id,
        brand: "Samsung",
        stock: 4,
        marketplace: "amazon",
        marketplaceId: "B09VHJMCGT",
        rating: 4.6,
        reviewCount: 65
      }
    ];
    
    // Gaming
    const gaming = [
      {
        name: "PlayStation 5 Digital Edition",
        description: "Next-gen gaming console with ultra-high speed SSD, ray tracing, and 4K gaming",
        price: 399.99,
        originalPrice: null,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=PS5+Digital",
        condition: "new",
        categoryId: gamingCategory.id,
        brand: "Sony",
        stock: 9,
        marketplace: "direct",
        rating: 4.9,
        reviewCount: 248
      },
      {
        name: "Xbox Series X",
        description: "Microsoft's most powerful console with 12 teraflops of processing power and 1TB SSD",
        price: 449.99,
        originalPrice: 499.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Xbox+Series+X",
        condition: "refurbished",
        categoryId: gamingCategory.id,
        brand: "Microsoft",
        stock: 6,
        marketplace: "amazon",
        marketplaceId: "B08H75RTZ8",
        rating: 4.8,
        reviewCount: 197
      },
      {
        name: "Nintendo Switch OLED",
        description: "7-inch OLED screen, 64GB storage, enhanced audio, and wired LAN port",
        price: 299.99,
        originalPrice: 349.99,
        imageUrl: "https://placehold.co/600x400/333/FFF?text=Nintendo+Switch",
        condition: "used",
        categoryId: gamingCategory.id,
        brand: "Nintendo",
        stock: 11,
        marketplace: "ebay",
        marketplaceId: "E1234567",
        rating: 4.7,
        reviewCount: 132
      }
    ];
    
    // Create all products
    const allProducts = [...laptops, ...smartphones, ...tablets, ...headphones, ...tvs, ...gaming];
    
    for (const product of allProducts) {
      await this.createProduct(product);
    }
    
    console.log(`Initialized ${allProducts.length} sample products`);
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

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: insertUser.isAdmin ?? false 
    };
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
    // Ensure icon has proper value
    const category: Category = { 
      ...insertCategory, 
      id,
      icon: insertCategory.icon || null 
    };
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
    
    // Ensure all required fields have appropriate default values
    const product: Product = { 
      ...insertProduct, 
      id,
      marketplace: insertProduct.marketplace || null,
      originalPrice: insertProduct.originalPrice || null,
      marketplaceId: insertProduct.marketplaceId || null,
      rating: insertProduct.rating || null,
      reviewCount: insertProduct.reviewCount || null,
      stock: insertProduct.stock || null
    };
    
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
  
  async updateInventory(productId: number, quantity: number | null): Promise<Inventory> {
    // Ensure quantity is a number (default to 0 if null)
    const safeQuantity = quantity === null ? 0 : quantity;
    
    // Check if inventory exists
    const existingInventory = await this.getInventory(productId);
    
    if (existingInventory) {
      // Update existing inventory
      const updatedInventory: Inventory = {
        ...existingInventory,
        quantity: safeQuantity,
        lastUpdated: new Date(),
      };
      this.inventories.set(existingInventory.id, updatedInventory);
      
      // Update product stock
      const product = this.products.get(productId);
      if (product) {
        this.products.set(productId, { ...product, stock: safeQuantity });
      }
      
      return updatedInventory;
    } else {
      // Create new inventory
      const id = this.currentInventoryId++;
      const newInventory: Inventory = {
        id,
        productId,
        quantity: safeQuantity,
        lastUpdated: new Date(),
      };
      this.inventories.set(id, newInventory);
      
      // Update product stock
      const product = this.products.get(productId);
      if (product) {
        this.products.set(productId, { ...product, stock: safeQuantity });
      }
      
      return newInventory;
    }
  }
  
  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async getCartItem(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }
  
  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this user and product
    const existingItem = await this.getCartItem(item.userId, item.productId);
    
    if (existingItem) {
      // Update quantity if item already exists
      return this.updateCartItemQuantity(
        item.userId,
        item.productId,
        existingItem.quantity + item.quantity
      );
    }
    
    // Create new cart item
    const id = this.currentCartItemId++;
    const cartItem: CartItem = {
      id,
      ...item,
      addedAt: new Date()
    };
    
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(userId: number, productId: number, quantity: number): Promise<CartItem> {
    const existingItem = await this.getCartItem(userId, productId);
    
    if (!existingItem) {
      throw new Error(`Cart item not found for user ${userId} and product ${productId}`);
    }
    
    const updatedItem: CartItem = {
      ...existingItem,
      quantity
    };
    
    this.cartItems.set(existingItem.id, updatedItem);
    return updatedItem;
  }
  
  async removeCartItem(userId: number, productId: number): Promise<boolean> {
    const existingItem = await this.getCartItem(userId, productId);
    
    if (!existingItem) {
      return false;
    }
    
    return this.cartItems.delete(existingItem.id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const cartItems = await this.getCartItems(userId);
    
    for (const item of cartItems) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }
  
  // Order operations
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      id,
      ...orderData,
      orderDate: new Date()
    };
    
    this.orders.set(id, order);
    return order;
  }
  
  async createOrderItems(items: InsertOrderItem[]): Promise<OrderItem[]> {
    const createdItems: OrderItem[] = [];
    
    for (const item of items) {
      const id = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        id,
        ...item
      };
      
      this.orderItems.set(id, orderItem);
      createdItems.push(orderItem);
      
      // Update inventory
      const product = await this.getProductById(item.productId);
      if (product && product.stock) {
        await this.updateInventory(item.productId, Math.max(0, product.stock - item.quantity));
      }
    }
    
    return createdItems;
  }
  
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime()); // Sort by date descending
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = await this.getOrderById(id);
    
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    const updatedOrder: Order = {
      ...order,
      status
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async updateOrderTracking(id: number, trackingNumber: string): Promise<Order> {
    const order = await this.getOrderById(id);
    
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    const updatedOrder: Order = {
      ...order,
      trackingNumber
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

// Export a singleton instance
export const storage = new MemStorage();

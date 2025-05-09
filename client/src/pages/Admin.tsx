import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { InsertProduct, Product, Category, productConditions, marketplaces } from '@shared/schema';
import { Helmet } from 'react-helmet';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Create validation schema based on product schema
  const formSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    originalPrice: z.coerce.number().min(0).optional(),
    imageUrl: z.string().url('Must be a valid URL'),
    condition: z.enum(productConditions),
    categoryId: z.coerce.number().min(1, 'Please select a category'),
    marketplace: z.enum(marketplaces).optional(),
    marketplaceId: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).default(0),
    reviewCount: z.coerce.number().min(0).default(0),
    stock: z.coerce.number().min(0).default(0),
    brand: z.string().min(1, 'Brand is required'),
  });

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      imageUrl: '',
      condition: 'new',
      categoryId: 0,
      marketplace: undefined,
      marketplaceId: '',
      rating: 0,
      reviewCount: 0,
      stock: 0,
      brand: '',
    },
  });

  // Reset form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice,
        imageUrl: editingProduct.imageUrl,
        condition: editingProduct.condition as any,
        categoryId: editingProduct.categoryId,
        marketplace: editingProduct.marketplace as any,
        marketplaceId: editingProduct.marketplaceId,
        rating: editingProduct.rating,
        reviewCount: editingProduct.reviewCount,
        stock: editingProduct.stock,
        brand: editingProduct.brand,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        imageUrl: '',
        condition: 'new',
        categoryId: 0,
        marketplace: undefined,
        marketplaceId: '',
        rating: 0,
        reviewCount: 0,
        stock: 0,
        brand: '',
      });
    }
  }, [editingProduct, form]);

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await apiRequest('POST', '/api/products', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsAddProductOpen(false);
      toast({
        title: 'Success',
        description: 'Product has been added successfully',
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      const response = await apiRequest('PATCH', `/api/products/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsAddProductOpen(false);
      setEditingProduct(null);
      toast({
        title: 'Success',
        description: 'Product has been updated successfully',
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Product has been deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete product: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/inventory/${productId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Success',
        description: 'Inventory has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update inventory: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      addProductMutation.mutate(data as InsertProduct);
    }
  };

  // Handle product delete
  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Handle inventory update
  const handleUpdateInventory = (productId: number, stock: string) => {
    const quantity = parseInt(stock, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      updateInventoryMutation.mutate({ productId, quantity });
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a valid stock quantity',
        variant: 'destructive',
      });
    }
  };

  // Find category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Format condition to capitalize first letter
  const formatCondition = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Borabyte</title>
        <meta name="description" content="Admin dashboard for Borabyte electronics marketplace. Manage products, inventory, and marketplace integrations." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Manage your products, inventory, and marketplace integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="integrations">Marketplace Integrations</TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Product Management</h2>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-[#FF9900] hover:bg-yellow-600"
                        onClick={() => {
                          setEditingProduct(null);
                          form.reset();
                        }}
                      >
                        <i className="fas fa-plus mr-2"></i> Add New Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                          {editingProduct 
                            ? 'Update the product details below' 
                            : 'Fill out the form below to add a new product to your inventory'}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Product name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="brand"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Brand</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Brand name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Detailed product description" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price ($)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" min="0" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="originalPrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Original Price ($)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      min="0" 
                                      placeholder="Optional" 
                                      {...field}
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                        field.onChange(value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock Quantity</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0" step="1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="condition"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Condition</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {productConditions.map(condition => (
                                        <SelectItem key={condition} value={condition}>
                                          {formatCondition(condition)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="categoryId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value?.toString()}
                                    value={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="marketplace"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Marketplace</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    value={field.value || ''}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select marketplace (optional)" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="">None</SelectItem>
                                      {marketplaces.map(marketplace => (
                                        <SelectItem key={marketplace} value={marketplace}>
                                          {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="marketplaceId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Marketplace ID</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Optional external ID" 
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Image URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter a valid URL for the product image
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="rating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rating (0-5)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      max="5" 
                                      step="0.1" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="reviewCount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Review Count</FormLabel>
                                  <FormControl>
                                    <Input type="number" min="0" step="1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              className="bg-[#FF9900] hover:bg-yellow-600"
                              disabled={form.formState.isSubmitting || addProductMutation.isPending || updateProductMutation.isPending}
                            >
                              {editingProduct ? 'Update Product' : 'Add Product'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableCaption>List of all products in your inventory</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <i className="fas fa-circle-notch fa-spin text-2xl text-[#FF9900] mb-2"></i>
                              <span>Loading products...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <i className="fas fa-box-open text-2xl text-gray-400 mb-2"></i>
                              <span className="text-gray-500">No products found</span>
                              <Button 
                                className="mt-4 bg-[#FF9900] hover:bg-yellow-600" 
                                onClick={() => setIsAddProductOpen(true)}
                              >
                                Add Your First Product
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded" 
                              />
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                product.condition === 'new' 
                                  ? 'bg-[#00A650]' 
                                  : product.condition === 'refurbished' 
                                  ? 'bg-[#0066C0]' 
                                  : 'bg-[#C45500]'
                              }`}>
                                {formatCondition(product.condition)}
                              </span>
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsAddProductOpen(true);
                                }}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory">
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Manage your product inventory levels</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Update Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <i className="fas fa-circle-notch fa-spin text-2xl text-[#FF9900] mb-2"></i>
                              <span>Loading inventory...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center justify-center">
                              <i className="fas fa-box-open text-2xl text-gray-400 mb-2"></i>
                              <span className="text-gray-500">No products in inventory</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => {
                          const [stockValue, setStockValue] = useState(product.stock.toString());
                          const [isUpdating, setIsUpdating] = useState(false);

                          return (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                  product.condition === 'new' 
                                    ? 'bg-[#00A650]' 
                                    : product.condition === 'refurbished' 
                                    ? 'bg-[#0066C0]' 
                                    : 'bg-[#C45500]'
                                }`}>
                                  {formatCondition(product.condition)}
                                </span>
                              </TableCell>
                              <TableCell className={product.stock <= 0 ? 'text-red-500 font-bold' : ''}>
                                {product.stock} {product.stock <= 0 && '(Out of Stock)'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    value={stockValue}
                                    onChange={(e) => setStockValue(e.target.value)}
                                    className="w-20"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  size="sm"
                                  className="bg-[#FF9900] hover:bg-yellow-600"
                                  onClick={() => {
                                    setIsUpdating(true);
                                    handleUpdateInventory(product.id, stockValue);
                                    setIsUpdating(false);
                                  }}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? (
                                    <i className="fas fa-circle-notch fa-spin"></i>
                                  ) : (
                                    <>Update</>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Marketplace Integrations Tab */}
              <TabsContent value="integrations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Amazon Integration</CardTitle>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Connected</span>
                      </div>
                      <CardDescription>
                        Manage your Amazon marketplace integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Products Synced</span>
                          <span className="font-bold">1,243</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Last Sync</span>
                          <span className="font-bold">Today, 2:30 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Sync Status</span>
                          <span className="text-green-600 font-bold">Up to date</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#FF9900] hover:bg-yellow-600">
                        Sync Products from Amazon
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>eBay Integration</CardTitle>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Connected</span>
                      </div>
                      <CardDescription>
                        Manage your eBay marketplace integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Products Synced</span>
                          <span className="font-bold">876</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Last Sync</span>
                          <span className="font-bold">Today, 1:15 PM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Sync Status</span>
                          <span className="text-yellow-600 font-bold">Updates Available</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-[#FF9900] hover:bg-yellow-600">
                        Sync Products from eBay
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Integration Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Automatic Sync Settings</CardTitle>
                        <CardDescription>
                          Configure how products are synchronized with marketplaces
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Auto-sync inventory</span>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="auto-sync" className="rounded text-[#FF9900] focus:ring-[#FF9900]" defaultChecked />
                              <label htmlFor="auto-sync">Enabled</label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Sync frequency</span>
                            <Select defaultValue="hourly">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Sync price changes</span>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="sync-price" className="rounded text-[#FF9900] focus:ring-[#FF9900]" defaultChecked />
                              <label htmlFor="sync-price">Enabled</label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-[#FF9900] hover:bg-yellow-600">
                          Save Settings
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>API Credentials</CardTitle>
                        <CardDescription>
                          Manage your marketplace API credentials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Amazon API Key</label>
                            <Input type="password" value="••••••••••••••••" readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">eBay API Key</label>
                            <Input type="password" value="••••••••••••••••" readOnly />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-[#FF9900] hover:bg-yellow-600">
                          Update Credentials
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

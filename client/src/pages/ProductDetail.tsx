import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

export default function ProductDetail() {
  const [match, params] = useRoute('/product/:id');
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (!match || !params?.id) {
    return <div>Product not found</div>;
  }

  const productId = parseInt(params.id, 10);

  const { data: product, isLoading, error } = useQuery<Product & { inventoryDetails?: any }>({
    queryKey: [`/api/products/${productId}`],
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && (product?.stock ? newQuantity <= product.stock : true)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product?.name} has been added to your cart.`,
    });
  };

  const getConditionBadgeClass = (condition?: string) => {
    switch(condition) {
      case 'new': return 'condition-badge-new';
      case 'refurbished': return 'condition-badge-refurbished';
      case 'used': return 'condition-badge-used';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCondition = (condition?: string) => {
    if (!condition) return '';
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 w-full h-96 rounded-lg"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-24 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
          <p className="mb-4">We couldn't find the product you're looking for. It may have been removed or the ID is invalid.</p>
          <Link href="/">
            <Button className="bg-[#FF9900] hover:bg-yellow-600 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Borabyte</title>
        <meta name="description" content={`${product.description.substring(0, 160)}...`} />
        <meta property="og:title" content={`${product.name} - Borabyte`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#FF9900]">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href={`/category/${product.categoryId}`} className="text-gray-500 hover:text-[#FF9900]">Category</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-700">{product.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="relative">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-auto rounded-lg"
                />
                <span className={`absolute top-4 left-4 ${getConditionBadgeClass(product.condition)} text-sm font-bold px-3 py-1 rounded-full`}>
                  {formatCondition(product.condition)}
                </span>
                
                {product.marketplace && (
                  <div className="absolute top-4 right-4 bg-[#232F3E] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <p className="text-gray-600 mr-2">Brand: <span className="font-medium">{product.brand}</span></p>
                <div className="text-yellow-400 flex items-center">
                  {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                  {product.rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
                  {Array.from({ length: 5 - Math.ceil(product.rating) }).map((_, i) => (
                    <i key={`empty-${i}`} className="far fa-star"></i>
                  ))}
                  <span className="text-gray-600 ml-1">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-[#FF9900]">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <Badge className="ml-2 bg-green-600">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-1">
                  {product.stock && product.stock > 0 
                    ? `In Stock: ${product.stock} available` 
                    : "Out of Stock"}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Quantity selector */}
              <div className="flex items-center mb-6">
                <span className="mr-3">Quantity:</span>
                <div className="flex border rounded-md">
                  <button 
                    className="px-3 py-1 border-r hover:bg-gray-100" 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    className="px-3 py-1 border-l hover:bg-gray-100" 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock ? quantity >= product.stock : false}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="flex-1 bg-[#FF9900] hover:bg-yellow-600 text-white py-3" 
                  onClick={handleAddToCart}
                  disabled={product.stock ? product.stock <= 0 : false}
                >
                  <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#FF9900] text-[#FF9900] hover:bg-[#FFF8EC] py-3"
                >
                  <i className="far fa-heart mr-2"></i> Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="specifications">
              <TabsList className="w-full border-b">
                <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                <TabsTrigger value="warranty" className="flex-1">Warranty</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b pb-2">
                    <p className="text-gray-500">Brand</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500">Condition</p>
                    <p className="font-medium">{formatCondition(product.condition)}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500">Marketplace</p>
                    <p className="font-medium">{product.marketplace ? product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1) : 'Direct'}</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500">Stock</p>
                    <p className="font-medium">{product.stock || 0} units</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium">{product.inventoryDetails?.lastUpdated ? new Date(product.inventoryDetails.lastUpdated).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="description" className="p-4">
                <p className="text-gray-700">{product.description}</p>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-4">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="text-yellow-400 flex items-center">
                      {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                      {product.rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
                      {Array.from({ length: 5 - Math.ceil(product.rating) }).map((_, i) => (
                        <i key={`empty-${i}`} className="far fa-star"></i>
                      ))}
                      <span className="text-gray-700 ml-2 text-lg font-medium">
                        {product.rating.toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">{product.reviewCount} customer ratings</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-gray-700">Customer reviews are not available for this product yet.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="warranty" className="p-4">
                {product.condition === 'new' && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Manufacturer's Warranty</h3>
                    <p className="mb-4">This product comes with the full manufacturer's warranty. The exact warranty length and terms depend on the manufacturer's policies.</p>
                    <p>For warranty claims or inquiries, please contact our customer service team with your order number.</p>
                  </div>
                )}
                
                {product.condition === 'refurbished' && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">90-Day Warranty</h3>
                    <p className="mb-4">This refurbished product comes with a 90-day warranty that covers all functional aspects of the device. If any functional issues arise within this period, we'll repair or replace the item at no cost to you.</p>
                    <p>For warranty claims or inquiries, please contact our customer service team with your order number.</p>
                  </div>
                )}
                
                {product.condition === 'used' && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">30-Day Return Policy</h3>
                    <p className="mb-4">This used product comes with a 30-day return policy for functional issues. Cosmetic imperfections described in the product listing are not covered.</p>
                    <p>For return inquiries, please contact our customer service team with your order number within 30 days of purchase.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}

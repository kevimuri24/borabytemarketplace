import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductGridProps {
  filters?: {
    categoryId?: number;
    condition?: string[];
    marketplaces?: string[];
    priceRange?: { min?: number; max?: number };
    brand?: string[];
    search?: string;
  };
  title?: string;
}

export default function ProductGrid({ filters, title = "Latest Products" }: ProductGridProps) {
  const [sortOption, setSortOption] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Build query string from filters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (filters?.categoryId) {
      params.append('categoryId', filters.categoryId.toString());
    }
    
    if (filters?.condition?.length) {
      filters.condition.forEach(c => params.append('condition', c));
    }
    
    if (filters?.marketplaces?.length) {
      filters.marketplaces.forEach(m => params.append('marketplace', m));
    }
    
    if (filters?.priceRange) {
      if (filters.priceRange.min !== undefined) {
        params.append('minPrice', filters.priceRange.min.toString());
      }
      if (filters.priceRange.max !== undefined) {
        params.append('maxPrice', filters.priceRange.max.toString());
      }
    }
    
    if (filters?.brand?.length) {
      filters.brand.forEach(b => params.append('brand', b));
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    return params.toString();
  };

  const queryString = buildQueryParams();
  const queryKey = queryString ? `/api/products?${queryString}` : '/api/products';
  
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: [queryKey],
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default: // featured
        return 0;
    }
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (isLoading) {
    return (
      <div className="md:w-3/4 lg:w-4/5">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="flex items-center mt-4 sm:mt-0">
            <span className="mr-2 text-sm text-gray-600">Sort by:</span>
            <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="product-grid mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:w-3/4 lg:w-4/5">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-500">Error Loading Products</h2>
          <p className="mt-2">We encountered an error while loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-3/4 lg:w-4/5">
      {/* Product sorting options */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center mt-4 sm:mt-0">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <Select
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="border rounded focus:ring-[#FF9900] focus:border-[#FF9900] w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Product grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <i className="fas fa-search text-4xl text-gray-400 mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <>
          <div className="product-grid mb-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="inline-flex shadow-sm rounded-md">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 bg-white text-gray-500 rounded-l-md hover:bg-gray-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border border-gray-300 ${
                      currentPage === index + 1 
                        ? 'bg-[#FF9900] text-white hover:bg-yellow-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-r-md hover:bg-gray-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}

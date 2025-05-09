import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import CategoryPills from '@/components/CategoryPills';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import { Category } from '@shared/schema';
import { Helmet } from 'react-helmet';

export default function CategoryPage() {
  const [match, params] = useRoute('/category/:slug');
  const [location] = useLocation();
  const [filters, setFilters] = useState<any>({});
  
  // Extract query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    
    const newFilters: any = {};
    
    // Handle condition filter
    const condition = searchParams.getAll('condition');
    if (condition.length > 0) {
      newFilters.condition = condition;
    }
    
    // Handle marketplace filter
    const marketplace = searchParams.getAll('marketplace');
    if (marketplace.length > 0) {
      newFilters.marketplace = marketplace;
    }
    
    // Handle price range filter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      newFilters.priceRange = {};
      if (minPrice) newFilters.priceRange.min = parseFloat(minPrice);
      if (maxPrice) newFilters.priceRange.max = parseFloat(maxPrice);
    }
    
    // Handle brand filter
    const brand = searchParams.getAll('brand');
    if (brand.length > 0) {
      newFilters.brand = brand;
    }
    
    // Handle search query
    const search = searchParams.get('search');
    if (search) {
      newFilters.search = search;
    }
    
    setFilters(newFilters);
  }, [location]);
  
  // Get category information
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${params?.slug}`],
    enabled: params?.slug !== 'all' && !!params?.slug,
  });
  
  // Fetch all categories for filter sidebar
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // When filters are applied
  const handleApplyFilters = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Update URL with new filters
    const searchParams = new URLSearchParams();
    
    if (newFilters.condition) {
      newFilters.condition.forEach((c: string) => searchParams.append('condition', c));
    }
    
    if (newFilters.marketplace) {
      newFilters.marketplace.forEach((m: string) => searchParams.append('marketplace', m));
    }
    
    if (newFilters.priceRange) {
      if (newFilters.priceRange.min !== undefined) {
        searchParams.append('minPrice', newFilters.priceRange.min.toString());
      }
      if (newFilters.priceRange.max !== undefined) {
        searchParams.append('maxPrice', newFilters.priceRange.max.toString());
      }
    }
    
    if (newFilters.brand) {
      newFilters.brand.forEach((b: string) => searchParams.append('brand', b));
    }
    
    // Preserve search query if it exists
    if (filters.search) {
      searchParams.append('search', filters.search);
    }
    
    const queryString = searchParams.toString();
    const newUrl = `/category/${params?.slug}${queryString ? `?${queryString}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  if (!match) {
    return <div>Category not found</div>;
  }

  // Prepare combined filters for ProductGrid
  const combinedFilters: any = { ...filters };
  
  // Add categoryId to filters if not 'all'
  if (params?.slug !== 'all' && category) {
    combinedFilters.categoryId = category.id;
  }

  return (
    <>
      <Helmet>
        <title>{category?.name || 'All Products'} - Borabyte</title>
        <meta 
          name="description" 
          content={`Shop ${category?.name || 'all products'} at Borabyte. Find new, refurbished, and used electronics at great prices.`}
        />
        <meta property="og:title" content={`${category?.name || 'All Products'} - Borabyte`} />
        <meta 
          property="og:description" 
          content={`Shop ${category?.name || 'all products'} at Borabyte. Find new, refurbished, and used electronics at great prices.`}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <CategoryPills selectedCategory={params?.slug} />
        
        {/* Category Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {category?.name || 'All Products'}
          </h1>
          {filters.search && (
            <p className="text-gray-600 mt-2">
              Search results for: <span className="font-medium">"{filters.search}"</span>
            </p>
          )}
        </div>
        
        {/* Main content with filters and products */}
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            currentFilters={filters}
            onApplyFilters={handleApplyFilters}
          />
          
          <ProductGrid 
            filters={combinedFilters}
            title={category?.name || 'All Products'}
          />
        </div>
      </main>
    </>
  );
}

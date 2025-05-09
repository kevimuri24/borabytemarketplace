import { Helmet } from 'react-helmet';
import HeroBanner from '@/components/HeroBanner';
import CategoryPills from '@/components/CategoryPills';
import FeaturedCategories from '@/components/FeaturedCategories';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import MarketplaceIntegration from '@/components/MarketplaceIntegration';
import { useState } from 'react';

export default function Home() {
  const [filters, setFilters] = useState({});

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Helmet>
        <title>Borabyte - Your Electronics Marketplace</title>
        <meta name="description" content="Shop for new, refurbished, and used electronics at Borabyte. Find great deals on laptops, smartphones, headphones, and more." />
        <meta property="og:title" content="Borabyte - Your Electronics Marketplace" />
        <meta property="og:description" content="Shop for new, refurbished, and used electronics at Borabyte. Find great deals on laptops, smartphones, headphones, and more." />
        <meta property="og:type" content="website" />
      </Helmet>

      <HeroBanner />
      
      <main className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <CategoryPills />
        
        {/* Featured Categories */}
        <FeaturedCategories />
        
        {/* Main content with filters and products */}
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar 
            currentFilters={filters}
            onApplyFilters={handleApplyFilters}
          />
          
          <ProductGrid 
            filters={filters}
            title="Latest Products"
          />
        </div>
        
        {/* Marketplace Integration */}
        <MarketplaceIntegration />
      </main>
    </>
  );
}

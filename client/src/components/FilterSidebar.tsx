import { useState } from 'react';
import { useLocation } from 'wouter';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  categoryId?: number;
  conditions?: string[];
  marketplaces?: string[];
  priceRanges?: {min?: number, max?: number}[];
  brands?: string[];
  currentFilters: {
    condition?: string[];
    marketplace?: string[];
    priceRange?: {min?: number, max?: number};
    brand?: string[];
  };
  onApplyFilters: (filters: any) => void;
}

export default function FilterSidebar({
  conditions = ['new', 'refurbished', 'used'],
  marketplaces = ['amazon', 'ebay', 'direct'],
  priceRanges = [
    { max: 100 },
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000 }
  ],
  brands = ['Apple', 'Samsung', 'Dell', 'Sony'],
  currentFilters,
  onApplyFilters
}: FilterSidebarProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(currentFilters.condition || []);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(currentFilters.marketplace || []);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min?: number, max?: number} | undefined>(currentFilters.priceRange);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.brand || []);

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const handleMarketplaceToggle = (marketplace: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(marketplace) 
        ? prev.filter(m => m !== marketplace) 
        : [...prev, marketplace]
    );
  };

  const handlePriceRangeToggle = (range: {min?: number, max?: number}) => {
    setSelectedPriceRange(prev => 
      JSON.stringify(prev) === JSON.stringify(range) 
        ? undefined 
        : range
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      condition: selectedConditions.length > 0 ? selectedConditions : undefined,
      marketplace: selectedMarketplaces.length > 0 ? selectedMarketplaces : undefined,
      priceRange: selectedPriceRange,
      brand: selectedBrands.length > 0 ? selectedBrands : undefined
    });
  };

  return (
    <aside className="md:w-1/4 lg:w-1/5">
      <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
        <h3 className="font-bold text-lg mb-4">Filter Products</h3>
        
        {/* Condition filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Condition</h4>
          <div className="space-y-2">
            {conditions.map(condition => (
              <div key={condition} className="flex items-center">
                <Checkbox 
                  id={`condition-${condition}`} 
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() => handleConditionToggle(condition)}
                  className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                />
                <Label htmlFor={`condition-${condition}`} className="ml-2 capitalize">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Price Range</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => {
              const label = range.min === undefined 
                ? `Under $${range.max}`
                : range.max === undefined
                ? `Over $${range.min}`
                : `$${range.min} - $${range.max}`;
              
              const isChecked = selectedPriceRange && 
                selectedPriceRange.min === range.min && 
                selectedPriceRange.max === range.max;
              
              return (
                <div key={index} className="flex items-center">
                  <Checkbox 
                    id={`price-${index}`} 
                    checked={isChecked}
                    onCheckedChange={() => handlePriceRangeToggle(range)}
                    className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                  />
                  <Label htmlFor={`price-${index}`} className="ml-2">
                    {label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Brand filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Brand</h4>
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center">
                <Checkbox 
                  id={`brand-${brand}`} 
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                  className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                />
                <Label htmlFor={`brand-${brand}`} className="ml-2">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
          <button className="text-sm text-[#FF9900] hover:underline mt-2">Show more</button>
        </div>
        
        {/* Source filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Marketplace</h4>
          <div className="space-y-2">
            {marketplaces.map(marketplace => (
              <div key={marketplace} className="flex items-center">
                <Checkbox 
                  id={`marketplace-${marketplace}`} 
                  checked={selectedMarketplaces.includes(marketplace)}
                  onCheckedChange={() => handleMarketplaceToggle(marketplace)}
                  className="rounded text-[#FF9900] focus:ring-[#FF9900]"
                />
                <Label htmlFor={`marketplace-${marketplace}`} className="ml-2 capitalize">
                  {marketplace}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#FF9900] hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}

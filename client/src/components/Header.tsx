import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-[#006600] text-white">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-cube mr-2"></i>
              <span>Borabyte</span>
            </Link>
          </div>
          
          {/* Location selector */}
          <div className="hidden md:flex items-center mx-4">
            <i className="fas fa-map-marker-alt mr-1"></i>
            <span className="text-sm">Deliver to United States</span>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 rounded-md border-none text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#CC0000]"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-[#CC0000] hover:bg-[#AA0000] text-white rounded-r-md"
              >
                <i className="fas fa-search"></i>
              </Button>
            </div>
          </form>
          
          {/* User actions */}
          <div className="flex items-center">
            <Link href="#" className="hidden md:block px-3 py-2 hover:text-[#CC0000]">
              <div className="text-xs">Hello, Sign in</div>
              <div className="font-bold">Account & Lists</div>
            </Link>
            <Link href="#" className="hidden md:block px-3 py-2 hover:text-[#CC0000]">
              <div className="text-xs">Returns</div>
              <div className="font-bold">& Orders</div>
            </Link>
            <Link href="#" className="px-3 py-2 relative">
              <i className="fas fa-shopping-cart text-2xl"></i>
              <Badge className="absolute top-0 right-0 bg-[#CC0000] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </Badge>
            </Link>
            <Button 
              variant="ghost" 
              className="md:hidden ml-4 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </Button>
          </div>
        </div>
        
        {/* Category navigation */}
        <nav className="py-2 border-t border-white">
          <ul className="flex flex-wrap items-center">
            <li className="mr-6 py-1">
              <Link href="/category/all" className="hover:text-[#CC0000] flex items-center">
                <i className="fas fa-bars mr-2"></i>
                All Categories
              </Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/laptops" className="hover:text-[#CC0000]">Electronics</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/laptops" className="hover:text-[#CC0000]">Computers</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/smart-home" className="hover:text-[#CC0000]">Smart Home</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/gaming" className="hover:text-[#CC0000]">Gaming</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/smartphones" className="hover:text-[#CC0000]">Smartphones</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/headphones" className="hover:text-[#CC0000]">Audio</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/wearables" className="hover:text-[#CC0000]">Wearables</Link>
            </li>
            <li className="py-1 md:hidden">
              <Button variant="ghost" className="text-white hover:text-[#CC0000] p-0">
                More <i className="fas fa-chevron-down ml-1"></i>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

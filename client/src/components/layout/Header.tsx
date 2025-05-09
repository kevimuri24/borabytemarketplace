import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, ShoppingCart, MapPin } from "lucide-react";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-secondary text-white">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary flex items-center">
              <i className="fas fa-cube mr-2"></i>
              <span>Borabyte</span>
            </Link>
          </div>
          
          {/* Location selector */}
          <div className="hidden md:flex items-center mx-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Deliver to United States</span>
          </div>
          
          {/* Search bar */}
          <div className="flex-1 max-w-3xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 px-4 rounded-md border-none text-text focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          {/* User actions */}
          <div className="flex items-center">
            <Link href="#" className="hidden md:block px-3 py-2 hover:text-primary">
              <div className="text-xs">Hello, Sign in</div>
              <div className="font-bold">Account & Lists</div>
            </Link>
            <Link href="#" className="hidden md:block px-3 py-2 hover:text-primary">
              <div className="text-xs">Returns</div>
              <div className="font-bold">& Orders</div>
            </Link>
            <Link href="#" className="px-3 py-2 relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-0 right-0 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            </Link>
            <Sheet>
              <SheetTrigger asChild className="md:hidden ml-4">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-secondary text-white">
                <div className="py-4">
                  <h3 className="text-lg font-bold mb-4">Menu</h3>
                  <nav className="space-y-4">
                    <Link href="/" className="block py-2 hover:text-primary">Home</Link>
                    <Link href="/admin" className="block py-2 hover:text-primary">Admin</Link>
                    <div className="py-2 text-sm text-gray-400">Categories</div>
                    <Link href="/?category=laptops" className="block py-2 hover:text-primary">Laptops</Link>
                    <Link href="/?category=smartphones" className="block py-2 hover:text-primary">Smartphones</Link>
                    <Link href="/?category=headphones" className="block py-2 hover:text-primary">Headphones</Link>
                    <Link href="/?category=gaming" className="block py-2 hover:text-primary">Gaming</Link>
                    <Link href="/?category=tablets" className="block py-2 hover:text-primary">Tablets</Link>
                    <Link href="/?category=smartwatches" className="block py-2 hover:text-primary">Smartwatches</Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Category navigation */}
        <nav className="py-2 border-t border-accent">
          <ul className="flex flex-wrap items-center">
            <li className="mr-6 py-1">
              <Link href="#" className="hover:text-primary flex items-center">
                <i className="fas fa-bars mr-2"></i>
                All Categories
              </Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/?category=electronics" className="hover:text-primary">Electronics</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/?category=laptops" className="hover:text-primary">Computers</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/?category=smart-home" className="hover:text-primary">Smart Home</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/?category=gaming" className="hover:text-primary">Gaming</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/?category=smartphones" className="hover:text-primary">Smartphones</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/?category=headphones" className="hover:text-primary">Audio</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/?category=smartwatches" className="hover:text-primary">Wearables</Link>
            </li>
            <li className="py-1 md:hidden">
              <Link href="#" className="hover:text-primary">
                More <i className="fas fa-chevron-down ml-1"></i>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

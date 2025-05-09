import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const { toast } = useToast();
  
  const countries = [
    'United States', 
    'Canada', 
    'United Kingdom', 
    'Australia', 
    'Germany',
    'France',
    'Japan',
    'India',
    'Brazil',
    'Mexico'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Delivery Location Updated",
      description: `Your delivery location is now set to ${country}`,
    });
  };
  
  const fetchCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to view your cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    try {
      setIsCartLoading(true);
      const response = await apiRequest("GET", "/api/cart");
      const data = await response.json();
      setCartItems(data);
      navigate("/cart");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4">
        {/* Top Navigation */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-accent flex items-center">
              <i className="fas fa-cube mr-2"></i>
              <span>Borabyte</span>
            </Link>
          </div>
          
          {/* Location selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="hidden md:flex items-center mx-4 cursor-pointer hover:text-accent">
                <i className="fas fa-map-marker-alt mr-1"></i>
                <span className="text-sm">Deliver to {selectedCountry}</span>
                <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black p-2 w-48">
              {countries.map((country) => (
                <DropdownMenuItem 
                  key={country} 
                  className="cursor-pointer hover:bg-accent hover:text-primary rounded px-2 py-1 my-1"
                  onClick={() => handleCountryChange(country)}
                >
                  {country}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 rounded-md border-none text-[#333333] focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-secondary hover:bg-secondary/80 text-white rounded-r-md"
              >
                <i className="fas fa-search"></i>
              </Button>
            </div>
          </form>
          
          {/* User actions */}
          <div className="flex items-center">
            {user ? (
              <>
                <div className="hidden md:block px-3 py-2">
                  <div className="text-xs">Hello,</div>
                  <div className="font-bold">{user.username}</div>
                </div>
                {user.isAdmin && (
                  <Link href="/admin" className="hidden md:block px-3 py-2 hover:text-accent">
                    <div className="text-xs">Manage</div>
                    <div className="font-bold">Admin Panel</div>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  className="hidden md:block px-3 py-2 hover:text-accent"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <div className="text-xs">{logoutMutation.isPending ? "Logging out..." : "Click to"}</div>
                  <div className="font-bold">Sign Out</div>
                </Button>
              </>
            ) : (
              <Link href="/auth" className="hidden md:block px-3 py-2 hover:text-accent">
                <div className="text-xs">Hello, Sign in</div>
                <div className="font-bold">Account & Lists</div>
              </Link>
            )}
            <Link href="#" className="hidden md:block px-3 py-2 hover:text-accent">
              <div className="text-xs">Returns</div>
              <div className="font-bold">& Orders</div>
            </Link>
            <Button 
              onClick={fetchCart}
              disabled={isCartLoading}
              className="p-3 relative bg-transparent hover:bg-primary/20"
            >
              <i className="fas fa-shopping-cart text-2xl"></i>
              <Badge className="absolute top-0 right-0 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </Badge>
              {isCartLoading && <span className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-full"><i className="fas fa-spinner fa-spin text-white"></i></span>}
            </Button>
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
              <Link href="/category/all" className="hover:text-accent flex items-center">
                <i className="fas fa-bars mr-2"></i>
                All Categories
              </Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/laptops" className="hover:text-accent">Electronics</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/laptops" className="hover:text-accent">Computers</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/smart-home" className="hover:text-accent">Smart Home</Link>
            </li>
            <li className="mr-6 py-1">
              <Link href="/category/gaming" className="hover:text-accent">Gaming</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/smartphones" className="hover:text-accent">Smartphones</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/headphones" className="hover:text-accent">Audio</Link>
            </li>
            <li className="mr-6 py-1 hidden md:block">
              <Link href="/category/wearables" className="hover:text-accent">Wearables</Link>
            </li>
            {user?.isAdmin && (
              <li className="mr-6 py-1">
                <Link href="/admin" className="hover:text-accent flex items-center">
                  <i className="fas fa-cog mr-2"></i>
                  Admin
                </Link>
              </li>
            )}
            <li className="py-1 md:hidden">
              <Button variant="ghost" className="text-white hover:text-accent p-0">
                More <i className="fas fa-chevron-down ml-1"></i>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

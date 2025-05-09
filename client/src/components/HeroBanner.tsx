import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#232F3E] to-[#37475A] text-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Quality at Every Price</h1>
            <p className="text-lg mb-6">New, refurbished, and used electronics with peace of mind.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/all?condition=new">
                <Button className="bg-[#FF9900] hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold transition">
                  Shop New Items
                </Button>
              </Link>
              <Link href="/category/all?sort=price">
                <Button variant="outline" className="bg-white hover:bg-gray-100 text-[#232F3E] px-6 py-3 rounded-md font-semibold transition">
                  Explore Deals
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Electronics collection" 
                className="rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-[#FF9900] text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                Up to 50% Off
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

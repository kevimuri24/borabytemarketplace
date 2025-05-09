import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-[#006600] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Borabyte</h3>
            <p className="text-gray-100 mb-4">Your marketplace for new, refurbished, and used electronics at competitive prices.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-100 hover:text-[#CC0000]"><i className="fab fa-facebook-f"></i></Link>
              <Link href="#" className="text-gray-100 hover:text-[#CC0000]"><i className="fab fa-twitter"></i></Link>
              <Link href="#" className="text-gray-100 hover:text-[#CC0000]"><i className="fab fa-instagram"></i></Link>
              <Link href="#" className="text-gray-100 hover:text-[#CC0000]"><i className="fab fa-linkedin-in"></i></Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/category/all?condition=new" className="text-gray-100 hover:text-[#CC0000]">New Products</Link></li>
              <li><Link href="/category/all?condition=refurbished" className="text-gray-100 hover:text-[#CC0000]">Refurbished Products</Link></li>
              <li><Link href="/category/all?condition=used" className="text-gray-100 hover:text-[#CC0000]">Used Products</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Deals</Link></li>
              <li><Link href="/category/laptops" className="text-gray-100 hover:text-[#CC0000]">Electronics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">FAQ</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Shipping Policy</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Returns & Refunds</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Warranty Information</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">About Borabyte</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Careers</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Marketplace Partners</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-100 hover:text-[#CC0000]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#37475A] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Borabyte. All rights reserved.</p>
          <div className="flex space-x-4">
            {/* Payment method icons */}
            <i className="fab fa-cc-visa text-2xl"></i>
            <i className="fab fa-cc-mastercard text-2xl"></i>
            <i className="fab fa-cc-paypal text-2xl"></i>
            <i className="fab fa-cc-apple-pay text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

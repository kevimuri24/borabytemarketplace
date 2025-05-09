import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Borabyte</h3>
            <p className="text-gray-300 mb-4">
              Your marketplace for new, refurbished, and used electronics at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-primary">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?condition=new" className="text-gray-300 hover:text-primary">
                  New Products
                </Link>
              </li>
              <li>
                <Link href="/?condition=refurbished" className="text-gray-300 hover:text-primary">
                  Refurbished Products
                </Link>
              </li>
              <li>
                <Link href="/?condition=used" className="text-gray-300 hover:text-primary">
                  Used Products
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-300 hover:text-primary">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/?category=electronics" className="text-gray-300 hover:text-primary">
                  Electronics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-primary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-primary">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-primary">
                  Warranty Information
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary">
                  About Borabyte
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-primary">
                  Marketplace Partners
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Borabyte. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg"
              alt="Visa"
              className="h-6 bg-white rounded p-0.5"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg"
              alt="PayPal"
              className="h-6 bg-white rounded p-0.5"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-6 bg-white rounded p-0.5"
            >
              <path
                fill="#000000"
                d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489l-0.002,1.479h10.709c0.271,0,0.49-0.218,0.49-0.489v-0.992C18.71,5.231,18.491,5.011,17.72,5.011z"
              />
              <path
                fill="#000000"
                d="M8.026,18.511h9.694c0.271,0,0.489-0.219,0.489-0.489v-0.999c0-0.271-0.218-0.49-0.489-0.49H7.534l0.002,1.489C7.536,18.292,7.755,18.511,8.026,18.511z"
              />
              <path
                fill="#000000"
                d="M2.834,17.557h2.001l0.783-7.223H2.834V17.557z"
              />
              <path
                fill="#000000"
                d="M13.427,7.153H7.534v9.38h5.893c1.588,0,2.872-1.283,2.872-2.865V10.02C16.299,8.436,15.015,7.153,13.427,7.153z M12.065,13.208c0.321,0.019,0.641-0.03,0.961-0.123c0.223-0.09,0.435-0.222,0.614-0.394c0.188-0.185,0.338-0.414,0.435-0.661c0.104-0.271,0.147-0.559,0.124-0.848c0-0.202-0.027-0.403-0.079-0.602c-0.047-0.182-0.124-0.357-0.23-0.515c-0.105-0.153-0.239-0.281-0.394-0.378c-0.136-0.082-0.282-0.144-0.436-0.185c-0.176-0.045-0.356-0.068-0.538-0.068H11.08v3.774H12.065z"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

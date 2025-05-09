import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const getConditionBadgeClass = (condition: string) => {
    switch(condition) {
      case 'new': return 'condition-badge-new';
      case 'refurbished': return 'condition-badge-refurbished';
      case 'used': return 'condition-badge-used';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMarketplaceBadgeClass = (marketplace?: string) => {
    switch(marketplace) {
      case 'amazon': return 'marketplace-badge-amazon';
      case 'ebay': return 'marketplace-badge-ebay';
      case 'direct': return 'marketplace-badge-direct';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatCondition = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Wishlist Updated",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
        </Link>
        <span className={`absolute top-2 left-2 ${getConditionBadgeClass(product.condition)} text-xs font-bold px-2 py-1 rounded`}>
          {formatCondition(product.condition)}
        </span>
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100"
          onClick={handleToggleWishlist}
        >
          <i className="far fa-heart text-gray-600"></i>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-1">
          {product.marketplace && (
            <span className={`text-xs ${getMarketplaceBadgeClass(product.marketplace)} px-2 py-0.5 rounded mr-2`}>
              {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
            </span>
          )}
          <div className="text-yellow-400 text-sm">
            {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {product.rating % 1 >= 0.5 && <i className="fas fa-star-half-alt"></i>}
            {Array.from({ length: 5 - Math.ceil(product.rating) }).map((_, i) => (
              <i key={`empty-${i}`} className="far fa-star"></i>
            ))}
            <span className="text-gray-600 ml-1">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold mb-1 text-sm md:text-base hover:text-[#FF9900]">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
        <div className="flex items-baseline mb-3">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          className="w-full bg-[#FF9900] hover:bg-yellow-600 text-white font-semibold py-2 rounded transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

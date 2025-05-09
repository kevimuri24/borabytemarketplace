import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getConditionClass = (condition: string) => {
    switch (condition) {
      case "new":
        return "condition-new";
      case "refurbished":
        return "condition-refurbished";
      case "used":
        return "condition-used";
      default:
        return "bg-gray-500";
    }
  };

  const formatCondition = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const getMarketplaceBadge = (marketplace: string | null) => {
    if (!marketplace) return null;
    
    return marketplace.toLowerCase() === "amazon" ? (
      <Badge variant="secondary" className="text-xs bg-secondary text-white px-2 py-0.5 rounded mr-2">
        Amazon
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded mr-2">
        eBay
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="text-yellow-400 text-sm flex">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star"></i>
        ))}
        {halfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
        <span className="text-gray-600 ml-1">
          {rating} ({product.reviewCount})
        </span>
      </div>
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-2 left-2 ${getConditionClass(product.condition)} text-white text-xs font-bold px-2 py-1 rounded`}>
          {formatCondition(product.condition)}
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center mb-1">
          {getMarketplaceBadge(product.marketplace)}
          {renderStars(parseFloat(product.rating?.toString() || "0"))}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold mb-1 text-sm md:text-base hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
        <div className="flex items-baseline mb-3">
          <span className="text-lg font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <Button className="w-full bg-primary hover:bg-yellow-600 text-white font-semibold py-2 rounded transition">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

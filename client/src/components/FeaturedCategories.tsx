import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

export default function FeaturedCategories() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Image URLs for each category (matched by slug)
  const categoryImages: Record<string, string> = {
    laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    gaming: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    tvs: "https://images.unsplash.com/photo-1593784991095-a205069533cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-star text-[#FF9900] mr-2"></i> Featured Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
              <div className="w-full h-36 bg-gray-200"></div>
              <div className="p-3">
                <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Limit to 4 categories for display
  const displayCategories = categories.slice(0, 4);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-star text-[#FF9900] mr-2"></i> Featured Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayCategories.map((category) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="group cursor-pointer">
              <div className="rounded-lg overflow-hidden shadow-md transition transform group-hover:scale-105">
                <img 
                  src={categoryImages[category.slug] || "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
                  alt={`${category.name} category`} 
                  className="w-full h-36 object-cover"
                />
                <div className="bg-white p-3">
                  <h3 className="font-medium text-center">{category.name}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

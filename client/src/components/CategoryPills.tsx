import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

interface CategoryPillsProps {
  selectedCategory?: string;
}

export default function CategoryPills({ selectedCategory }: CategoryPillsProps) {
  const [, navigate] = useLocation();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleClick = (slug: string) => {
    navigate(`/category/${slug}`);
  };

  return (
    <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
      <Button
        key="all"
        onClick={() => handleClick('all')}
        className={`whitespace-nowrap ${
          selectedCategory === 'all' || !selectedCategory
            ? 'bg-[#232F3E] text-white'
            : 'bg-white hover:bg-gray-100 text-[#333333]'
        } px-4 py-2 rounded-full flex items-center`}
      >
        <i className="fas fa-th mr-2"></i> All Products
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => handleClick(category.slug)}
          className={`whitespace-nowrap ${
            selectedCategory === category.slug
              ? 'bg-[#232F3E] text-white'
              : 'bg-white hover:bg-gray-100 text-[#333333]'
          } px-4 py-2 rounded-full border flex items-center`}
        >
          <i className={`${category.icon || 'fas fa-tag'} mr-2`}></i> {category.name}
        </Button>
      ))}
    </div>
  );
}

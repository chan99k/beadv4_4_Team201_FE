'use client';

import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/product';

export interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

/**
 * ProductList - Grid layout for products with loading skeleton
 * 2-column grid on mobile, responsive
 */
export function ProductList({ products, isLoading }: ProductListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-1.5 px-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center mb-6">
          <span className="text-2xl grayscale opacity-50">📦</span>
        </div>
        <p className="text-xs font-black tracking-widest uppercase mb-1">No Results</p>
        <p className="text-[11px] text-gray-400">조건에 맞는 상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => router.push(`/products/${product.id}`)}
        />
      ))}
    </div>
  );
}

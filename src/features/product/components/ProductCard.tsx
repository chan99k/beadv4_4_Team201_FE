'use client';

import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { queryKeys } from '@/lib/query/keys';
import { getProduct } from '@/lib/api/products';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils/cn';

export interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

/**
 * ProductCard - Display product in grid layout
 * Used in product list and popular products section
 */
export function ProductCard({ product, onClick, className }: ProductCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.product(product.id),
      queryFn: () => getProduct(product.id),
      staleTime: 60 * 1000,
    });
  };

  return (
    <Card
      className={cn(
        'overflow-hidden cursor-pointer transition-shadow hover:shadow-lg',
        className
      )}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl || '/placeholder-product.png'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 leading-5">
          {product.name}
        </h3>
        <p className="text-lg font-bold tabular-nums">
          ₩{product.price.toLocaleString()}
        </p>
      </div>
    </Card>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product';

interface PopularProductsSectionProps {
    products: Product[];
}

export function PopularProductsSection({ products }: PopularProductsSectionProps) {
    const displayProducts = products.slice(0, 8);

    return (
        <section className="space-y-4 py-6 pb-12">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold">🔥 인기 상품</h2>
                <Link href="/products" className="text-xs text-muted-foreground hover:text-primary">
                    전체보기
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4">
                {displayProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-square w-full bg-secondary">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                {product.status === 'ON_SALE' && (
                                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                                        판매중
                                    </Badge>
                                )}
                            </div>
                            <div className="p-3">
                                <h3 className="line-clamp-2 text-sm font-medium min-h-[2.5rem]">
                                    {product.name}
                                </h3>
                                <p className="font-bold text-base mt-1">
                                    ₩{product.price.toLocaleString()}
                                </p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}

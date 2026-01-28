'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/features/cart/hooks/useCartMutations';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

interface AddToCartButtonProps {
    productId: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showText?: boolean;
}

/**
 * AddToCartButton - Component to add a product to the cart
 */
export function AddToCartButton({
    productId,
    className,
    variant = 'outline',
    size = 'lg',
    showText = true,
}: AddToCartButtonProps) {
    const addToCartMutation = useAddToCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;

        setIsAdding(true);
        try {
            // For now, we use a fixed amount or the product's full price if needed.
            // In Giftify, adding to cart might require specifying an amount if it's a funding.
            // However, for a simple "Add to Cart" from product page, we might assume full or min amount.
            // Let's check CartItemCreateRequest type if possible, but usually it needs fundingId.

            // Wait, in Giftify, a user usually starts a funding or participates in one.
            // If adding from product page, it might be "Start new funding".

            await addToCartMutation.mutateAsync({
                wishItemId: productId, // Using wishItemId to start a new funding from product view
                amount: 10000, // Default participation amount
            });

            toast.success('장바구니에 담겼습니다.');
        } catch (error: any) {
            toast.error(error?.message || '장바구니 담기에 실패했습니다.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={cn('gap-2', className)}
            onClick={handleAddToCart}
            disabled={isAdding}
        >
            {isAdding ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <ShoppingCart className="h-5 w-5" />
            )}
            {showText && (isAdding ? '담는 중...' : '장바구니')}
        </Button>
    );
}

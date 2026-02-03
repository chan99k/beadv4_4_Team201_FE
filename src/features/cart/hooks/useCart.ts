import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getCart } from '@/lib/api/cart';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useAddToCart as useAddToCartMutation } from './useCartMutations';
import { useCallback } from 'react';

/**
 * Hook to fetch the current user's cart with add functionality
 */
export function useCart() {
  const { user } = useUser();
  const addMutation = useAddToCartMutation();

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: !!user,
  });

  const addToCart = useCallback(async (params: { productId: string; quantity?: number }) => {
    return addMutation.mutateAsync({
      productId: params.productId,
      quantity: params.quantity || 1,
    });
  }, [addMutation]);

  return {
    ...query,
    addToCart,
    isLoading: query.isLoading || addMutation.isPending,
  };
}

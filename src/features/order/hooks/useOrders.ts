import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getOrder, getOrders } from '@/lib/api/orders';
import type { PageParams } from '@/types/api';

interface UseOrderOptions {
  enabled?: boolean;
}

export function useOrder(orderId: string, options?: UseOrderOptions) {
  const externalEnabled = options?.enabled ?? true;

  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => getOrder(orderId),
    enabled: !!orderId && externalEnabled,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

/**
 * Hook to fetch all orders for the current user
 * @param params - Pagination parameters (page, size)
 */
export function useOrders(params?: PageParams) {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => getOrders(params),
  });
}

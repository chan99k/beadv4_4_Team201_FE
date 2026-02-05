import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getWallet, getWalletHistory } from '@/lib/api/wallet';
import type { WalletHistoryQueryParams } from '@/types/wallet';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * Hook to fetch the current user's wallet balance
 */
export function useWallet() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: getWallet,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to fetch wallet transaction history
 * @param params - Query parameters (type, page, size)
 */
export function useWalletHistory(params?: WalletHistoryQueryParams) {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.walletHistory(params),
    queryFn: () => getWalletHistory(params),
    enabled: !!user,
  });
}

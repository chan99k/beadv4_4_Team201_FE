import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getPopularProducts } from '@/lib/api/products';
import type { HomeData } from '@/types/home';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useHomeData() {
  const { user } = useAuth();

  // 1. 인기 상품 조회 (비로그인 상태에서도 가능)
  const popularProductsQuery = useQuery({
    queryKey: queryKeys.products.popular(),
    queryFn: () => getPopularProducts(4),
  });

  // TODO: 로그인 시 펀딩, 위시리스트, 친구 소식 등을 병렬로 조회하여 조합
  // 현재는 인기 상품만 우선 연동

  const isLoading = popularProductsQuery.isLoading;
  const isError = popularProductsQuery.isError;
  const error = popularProductsQuery.error;
  const refetch = popularProductsQuery.refetch;

  const data: HomeData | undefined = popularProductsQuery.data ? {
    member: user as any, // 임시 타입 캐스팅
    myFundings: [], // TODO: useMyParticipatedFundings 연동
    friendsWishlists: [], // TODO: 친구 위시리스트 연동
    popularProducts: popularProductsQuery.data.items,
    walletBalance: 0, // TODO: useWallet 연동
  } : undefined;

  return {
    data,
    isLoading,
    isError,
    error,
    refetch
  };
}

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { queryKeys } from '@/lib/query/keys';
import { getHomeData } from '@/lib/api/home';
import { HomePageClient } from '@/features/home/components/HomePageClient';

export default async function HomePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.home,
    queryFn: getHomeData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}

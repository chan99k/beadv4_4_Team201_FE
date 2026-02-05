import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query/get-query-client';
import { queryKeys } from '@/lib/query/keys';
import { HomePageClient } from '@/features/home/components/HomePageClient';
import { auth0 } from '@/lib/auth/auth0';

export default async function HomePage() {
  const queryClient = getQueryClient();


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}

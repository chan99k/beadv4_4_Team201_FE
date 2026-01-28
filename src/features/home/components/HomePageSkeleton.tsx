'use client';

import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Welcome Section Skeleton */}
      <section className="px-4 py-6">
        <Skeleton className="h-24 w-full rounded-lg" />
      </section>

      <Separator className="h-2 bg-secondary/30" />

      {/* My Fundings Section Skeleton */}
      <section className="space-y-4 py-6">
        <div className="flex items-center justify-between px-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-[280px] shrink-0 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-5 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="h-2 bg-secondary/30" />

      {/* Friends' Wishlists Section Skeleton */}
      <section className="space-y-4 bg-secondary/30 py-6">
        <div className="flex items-center justify-between px-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="space-y-3 px-4">
          {[1, 2].map((i) => (
            <Card key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </Card>
          ))}
        </div>
      </section>

      <Separator className="h-2 bg-secondary/30" />

      {/* Popular Products Section Skeleton */}
      <section className="space-y-4 py-6 pb-12">
        <div className="px-4">
          <Skeleton className="h-6 w-24" />
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

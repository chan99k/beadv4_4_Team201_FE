'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Gift } from 'lucide-react';
import { FundingCard } from '@/components/common/FundingCard';
import { Button } from '@/components/ui/button';
import type { Funding } from '@/types/funding';

interface MyFundingsSectionProps {
    fundings: Funding[];
}

export function MyFundingsSection({ fundings }: MyFundingsSectionProps) {
    const router = useRouter();

    if (fundings.length === 0) {
        return (
            <section className="space-y-4 py-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-bold">🎁 참여 중인 펀딩</h2>
                </div>
                <div className="px-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center bg-secondary/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <Gift className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium mb-1">아직 참여 중인 펀딩이 없어요</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            친구의 위시리스트를 구경해보세요!
                        </p>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/wishlist">위시리스트 보기</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 py-6">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold">🎁 참여 중인 펀딩</h2>
                <Link href="/fundings/participated" className="flex items-center text-xs text-muted-foreground hover:text-primary">
                    더보기 <ChevronRight className="h-3 w-3" />
                </Link>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {fundings.map((funding) => (
                    <FundingCard
                        key={funding.id}
                        funding={{
                            id: funding.id,
                            product: {
                                name: funding.product.name,
                                imageUrl: funding.product.imageUrl,
                                price: funding.product.price,
                            },
                            targetAmount: funding.targetAmount,
                            currentAmount: funding.currentAmount,
                            status: funding.status,
                            expiresAt: funding.expiresAt,
                            participantCount: funding.participantCount,
                            recipient: {
                                nickname: funding.recipient.nickname,
                                avatarUrl: funding.recipient.avatarUrl || undefined,
                            },
                        }}
                        variant="carousel"
                        onClick={() => router.push(`/fundings/${funding.id}`)}
                        className="snap-start"
                    />
                ))}
            </div>
        </section>
    );
}

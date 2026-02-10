'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { useOrder } from '@/features/order/hooks/useOrders';

const PROCESSING_DELAY_MS = 1500;

const PAYMENT_METHOD_LABELS: Record<string, string> = {
    DEPOSIT: '지갑',
    CARD: '카드',
    KAKAO_PAY: '카카오페이',
    NAVER_PAY: '네이버페이',
    TOSS_PAY: '토스페이',
    ACCOUNT_TRANSFER: '계좌이체',
    BANK_TRANSFER: '은행이체',
    POINT: '포인트',
};

type Phase = 'processing' | 'fetching' | 'success' | 'error';

function CheckoutCompleteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [phase, setPhase] = useState<Phase>('processing');
    const [fetchEnabled, setFetchEnabled] = useState(false);

    const { data: order, isLoading, isError, refetch } = useOrder(orderId || '', {
        enabled: !!orderId && fetchEnabled,
    });

    useEffect(() => {
        if (!orderId) {
            router.replace('/');
            return;
        }

        const timer = setTimeout(() => {
            setPhase('fetching');
            setFetchEnabled(true);
        }, PROCESSING_DELAY_MS);

        return () => clearTimeout(timer);
    }, [orderId, router]);

    useEffect(() => {
        if (phase === 'fetching') {
            if (isError) {
                setPhase('error');
            } else if (order && !isLoading) {
                setPhase('success');
            }
        }
    }, [phase, isError, order, isLoading]);

    const handleClose = () => {
        router.push('/');
    };

    const closeButton = (
        <button
            onClick={handleClose}
            className="p-2 -mr-2 hover:bg-accent rounded-md transition-colors"
            aria-label="닫기"
        >
            <X className="h-5 w-5" />
        </button>
    );

    if (phase === 'processing') {
        return (
            <AppShell
                headerTitle="결제 완료"
                headerVariant="detail"
                hasBack={false}
                showBottomNav={false}
                hideHeaderActions
            >
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-4 px-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" strokeWidth={1.5} />
                    <p className="text-lg font-medium text-center">결제를 처리하고 있어요</p>
                    <p className="text-sm text-muted-foreground text-center">잠시만 기다려주세요</p>
                </div>
            </AppShell>
        );
    }

    if (phase === 'fetching') {
        return (
            <AppShell
                headerTitle="결제 완료"
                headerVariant="detail"
                hasBack={false}
                showBottomNav={false}
                hideHeaderActions
                headerRight={closeButton}
            >
                <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
                </div>
            </AppShell>
        );
    }

    if (phase === 'error' || !order) {
        return (
            <AppShell
                headerTitle="결제 완료"
                headerVariant="detail"
                hasBack={false}
                showBottomNav={false}
                hideHeaderActions
                headerRight={closeButton}
            >
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-4 p-4">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-1">주문 정보를 찾을 수 없습니다</h3>
                        <p className="text-sm text-muted-foreground">
                            잠시 후 다시 시도해주세요.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                        <Button onClick={() => { setPhase('fetching'); refetch(); }}>
                            다시 시도
                        </Button>
                        <Button variant="ghost" onClick={() => router.push('/')}>
                            홈으로 이동
                        </Button>
                    </div>
                </div>
            </AppShell>
        );
    }

    const fundingItems = useMemo(
        () => order.items.filter((item) => item.orderItemType === 'FUNDING_GIFT'),
        [order.items]
    );

    return (
        <AppShell
            headerTitle="결제 완료"
            headerVariant="detail"
            hasBack={false}
            showBottomNav={false}
            hideHeaderActions
            headerRight={closeButton}
        >
            <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto">
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-in zoom-in-50 duration-500">
                        <CheckCircle className="h-10 w-10 text-primary animate-in fade-in duration-700" strokeWidth={1} />
                    </div>
                    <div className="text-center space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                        <h2 className="text-2xl font-bold">결제가 완료되었습니다!</h2>
                        <p className="text-sm text-muted-foreground">
                            {fundingItems.length > 0
                                ? `${fundingItems.length}건의 펀딩에 참여했어요`
                                : '주문이 성공적으로 완료되었습니다'}
                        </p>
                    </div>
                </div>

                {fundingItems.length > 0 && (
                    <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                        <h3 className="text-lg font-bold">펀딩 목록</h3>
                        <Card className="border-border bg-card">
                            <CardContent className="p-4 space-y-2">
                                {fundingItems.map((item, index) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                펀딩 참여 #{index + 1}
                                            </span>
                                            <span className="ml-2 flex-shrink-0 font-medium">
                                                {item.amount.toLocaleString()}원
                                            </span>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                    </section>
                )}

                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[400ms]">
                    <h3 className="text-lg font-bold">결제 정보</h3>
                    <Card className="border-border bg-card">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">주문번호</span>
                                <span className="font-mono text-xs">{order.order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">결제수단</span>
                                <span>
                                    {PAYMENT_METHOD_LABELS[order.order.paymentMethod] || order.order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">결제일시</span>
                                <span>
                                    {new Date(order.order.createdAt).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>결제금액</span>
                                <span className="text-primary">{order.order.totalAmount.toLocaleString()}원</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <div className="flex flex-col gap-3 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                    <Button
                        className="w-full h-12"
                        onClick={() => router.push('/')}
                    >
                        홈으로 가기
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full h-12"
                        onClick={() => router.push('/orders')}
                    >
                        주문 내역 보기
                    </Button>
                </div>

                <Footer />
            </div>
        </AppShell>
    );
}

export default function CheckoutCompletePage() {
    return (
        <Suspense fallback={
            <AppShell
                headerTitle="결제 완료"
                headerVariant="detail"
                hasBack={false}
                showBottomNav={false}
            >
                <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" strokeWidth={1.5} />
                </div>
            </AppShell>
        }>
            <CheckoutCompleteContent />
        </Suspense>
    );
}

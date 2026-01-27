import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { requestMockPayment, verifyMockPayment } from '@/features/payment/api/payment';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ChargeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (amount: number) => void;
}

const CHARGE_AMOUNTS = [10000, 30000, 50000, 100000];

export function ChargeModal({ open, onOpenChange, onSuccess }: ChargeModalProps) {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCharge = async () => {
        if (!selectedAmount) return;
        setLoading(true);
        try {
            const { paymentKey } = await requestMockPayment({
                orderId: `charge_${Date.now()}`,
                orderName: `${selectedAmount.toLocaleString()}P 충전`,
                amount: selectedAmount
            });

            await verifyMockPayment(paymentKey, `charge_${Date.now()}`, selectedAmount);

            toast.success(`${selectedAmount.toLocaleString()}P 충전이 완료되었습니다.`);
            onSuccess(selectedAmount);
            onOpenChange(false);
        } catch (e) {
            toast.error('충전 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>포인트 충전</DialogTitle>
                    <DialogDescription>
                        충전할 금액을 선택해주세요.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 py-4">
                    {CHARGE_AMOUNTS.map((amount) => (
                        <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            className={selectedAmount === amount ? "border-primary" : ""}
                            onClick={() => setSelectedAmount(amount)}
                        >
                            {amount.toLocaleString()}원
                        </Button>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        className="w-full font-bold"
                        onClick={handleCharge}
                        disabled={!selectedAmount || loading}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {selectedAmount ? `${selectedAmount.toLocaleString()}원 결제하기` : '금액을 선택해주세요'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface WalletBalanceProps {
    balance: number;
    onCharge: () => void;
}

export function WalletBalance({ balance, onCharge }: WalletBalanceProps) {
    return (
        <Card className="border-border bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">보유 포인트</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold tracking-tight">
                        {balance.toLocaleString()} P
                    </div>
                    <Button onClick={onCharge} size="sm" className="gap-1 rounded-full text-xs font-semibold">
                        <Plus className="h-3.5 w-3.5" />
                        충전하기
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

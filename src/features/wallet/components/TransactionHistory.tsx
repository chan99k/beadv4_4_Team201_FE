import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Transaction {
    id: string;
    type: 'CHARGE' | 'USE';
    amount: number;
    description: string;
    date: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">사용 내역</h3>
            <Card className="border-border bg-card">
                <CardContent className="p-0">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            내역이 없습니다.
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    </div>
                                    <div className={cn(
                                        "text-sm font-bold",
                                        tx.type === 'CHARGE' ? "text-primary" : "text-foreground"
                                    )}>
                                        {tx.type === 'CHARGE' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} P
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

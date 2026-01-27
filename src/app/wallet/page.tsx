'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { WalletBalance } from '@/features/wallet/components/WalletBalance';
import { TransactionHistory } from '@/features/wallet/components/TransactionHistory';
import { ChargeModal } from '@/features/wallet/components/ChargeModal';

interface Transaction {
    id: string;
    type: 'CHARGE' | 'USE';
    amount: number;
    description: string;
    date: string;
}

export default function WalletPage() {
    // Mock State (In real app, fetch from API)
    const [balance, setBalance] = useState(15000);
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', type: 'USE', amount: -4500, description: '스타벅스 아메리카노 구매', date: '2023.10.15' },
        { id: '2', type: 'CHARGE', amount: 20000, description: '포인트 충전', date: '2023.10.10' },
    ]);
    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);

    const handleChargeSuccess = (amount: number) => {
        setBalance((prev) => prev + amount);
        const newTx: Transaction = {
            id: `new_${Date.now()}`,
            type: 'CHARGE',
            amount: amount,
            description: '포인트 충전',
            date: new Date().toLocaleDateString()
        };
        setTransactions((prev) => [newTx, ...prev]);
    };

    return (
        <AppShell
            headerTitle="내 지갑"
            headerVariant="main"
            showBottomNav={true}
        >
            <div className="p-4 space-y-8 pb-24">
                <section>
                    <WalletBalance
                        balance={balance}
                        onCharge={() => setIsChargeModalOpen(true)}
                    />
                </section>

                <section>
                    <TransactionHistory transactions={transactions} />
                </section>
            </div>

            <ChargeModal
                open={isChargeModalOpen}
                onOpenChange={setIsChargeModalOpen}
                onSuccess={handleChargeSuccess}
            />
        </AppShell>
    );
}

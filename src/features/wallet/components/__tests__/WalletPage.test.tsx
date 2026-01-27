import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import WalletPage from '@/app/wallet/page';

// Mock UI components
vi.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children, headerTitle }: any) => (
        <div data-testid="app-shell">
            <h1>{headerTitle}</h1>
            {children}
        </div>
    ),
}));

// Setup mock for toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock payment API
vi.mock('@/features/payment/api/payment', () => ({
    requestMockPayment: vi.fn().mockResolvedValue({ paymentKey: 'mock_pk', method: 'CARD' }),
    verifyMockPayment: vi.fn().mockResolvedValue({ status: 'DONE' }),
}));

describe('WalletPage Feature', () => {
    it('GIVEN wallet page, THEN it should display balance and history', () => {
        render(<WalletPage />);

        // Initial Balance (Mock state: 15000)
        expect(screen.getByText('15,000 P')).toBeInTheDocument();

        // Initial Transaction History
        expect(screen.getByText('스타벅스 아메리카노 구매')).toBeInTheDocument();
        expect(screen.getByText('-4,500 P')).toBeInTheDocument();
    });

    it('GIVEN charge flow, WHEN user charges points, THEN balance should update', async () => {
        const user = userEvent.setup();
        render(<WalletPage />);

        // 1. Open Charge Modal
        const chargeBtn = screen.getByRole('button', { name: /충전하기/i });
        await user.click(chargeBtn);

        expect(screen.getByRole('heading', { name: '포인트 충전' })).toBeInTheDocument();

        // 2. Select Amount (10,000)
        const amountBtn = screen.getByRole('button', { name: '10,000원' });
        await user.click(amountBtn);

        // 3. Click Charge (Payment)
        // The button text changes dynamically based on selection "10,000원 결제하기"
        const payBtn = screen.getByRole('button', { name: '10,000원 결제하기' });
        await user.click(payBtn);

        // 4. Verify Success
        const { toast } = await import('sonner');
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('10,000P 충전이 완료되었습니다.');
        });

        // 5. Verify Balance Update (15000 + 10000 = 25000)
        await waitFor(() => {
            expect(screen.getByText('25,000 P')).toBeInTheDocument();
        });
    });
});

import { renderHook, waitFor } from '@testing-library/react';
import { useRemoveWishlistItem } from '../useWishlistMutations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as api from '@/lib/api/wishlists';

// Mock the API
vi.mock('@/lib/api/wishlists', () => ({
    removeWishlistItem: vi.fn(),
}));

const mockWishlist = {
    id: 'wish-1',
    memberId: 'user-1',
    items: [
        { id: 'item-1', productId: 'p1', product: { name: 'P1', price: 1000 } },
        { id: 'item-2', productId: 'p2', product: { name: 'P2', price: 2000 } },
    ],
    itemCount: 2,
};

describe('useRemoveWishlistItem', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    it('optimistically removes an item from the wishlist', async () => {
        // Set initial cache data
        queryClient.setQueryData(['wishlists', 'me'], mockWishlist);

        // Mock API to return success after some delay
        (api.removeWishlistItem as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        const { result } = renderHook(() => useRemoveWishlistItem(), { wrapper });

        result.current.mutate('item-1');

        // Check cache immediately after mutation (should be updated optimistically)
        await waitFor(() => {
            const cachedData = queryClient.getQueryData(['wishlists', 'me']) as any;
            expect(cachedData.items).toHaveLength(1);
            expect(cachedData.items[0].id).toBe('item-2');
            expect(cachedData.itemCount).toBe(1);
        });

        // Wait for mutation to complete
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('rolls back cache on API error', async () => {
        // Set initial cache data
        queryClient.setQueryData(['wishlists', 'me'], mockWishlist);

        // Mock API to return error after some delay
        (api.removeWishlistItem as any).mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error('API Error')), 100)));

        const { result } = renderHook(() => useRemoveWishlistItem(), { wrapper });

        result.current.mutate('item-1');

        // Check optimistic update happened
        await waitFor(() => {
            const cachedData = queryClient.getQueryData(['wishlists', 'me']) as any;
            expect(cachedData.items).toHaveLength(1);
        });

        // Wait for error
        await waitFor(() => expect(result.current.isError).toBe(true));

        // Check cache rolled back
        const finalCachedData = queryClient.getQueryData(['wishlists', 'me']) as any;
        expect(finalCachedData.items).toHaveLength(2);
        expect(finalCachedData.itemCount).toBe(2);
    });
});

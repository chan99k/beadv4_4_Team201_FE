import { apiClient } from './client';
import type {
  Cart,
  CartItem,
  CartItemCreateRequest,
  CartItemUpdateRequest
} from '@/types/cart';

export async function getCart(): Promise<Cart> {
  return apiClient.get<Cart>('/api/v2/carts');
}

export async function addCartItem(data: CartItemCreateRequest): Promise<CartItem> {
  return apiClient.post<CartItem>('/api/v2/carts/add', data);
}

export async function updateCartItem(itemId: string, data: CartItemUpdateRequest): Promise<CartItem> {
  return apiClient.patch<CartItem>(`/api/v2/carts/items/${itemId}`, data);
}

export async function removeCartItem(itemId: string): Promise<void> {
  return apiClient.delete<void>(`/api/v2/carts/items/${itemId}`);
}

export async function toggleCartItemSelection(itemId: string, selected: boolean): Promise<CartItem> {
  return apiClient.patch<CartItem>(`/api/v2/carts/items/${itemId}`, { selected });
}

export async function clearCart(): Promise<void> {
  return apiClient.delete<void>('/api/v2/carts/clear');
}

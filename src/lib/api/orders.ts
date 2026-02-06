import { apiClient } from './client';
import type { PageParams } from '@/types/api';
import type {
  Order,
  OrderItem,
  OrderDetail,
  OrderCreateRequest,
  OrderListResponse
} from '@/types/order';

export async function createOrder(
  data?: OrderCreateRequest,
  idempotencyKey?: string
): Promise<Order> {
  return apiClient.post<Order>('/api/v2/orders', data || {}, { idempotencyKey });
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  return apiClient.get<OrderDetail>(`/api/v2/orders/${orderId}`);
}

export async function getOrders(params?: PageParams): Promise<OrderListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/v2/orders?${queryString}` : '/api/v2/orders';

  return apiClient.get<OrderListResponse>(endpoint);
}

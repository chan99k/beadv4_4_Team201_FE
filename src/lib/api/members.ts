import { apiClient } from './client';
import type { PageParams } from '@/types/api';
import type {
  Member,
  MemberPublic,
  MemberUpdateRequest,
  MemberListResponse
} from '@/types/member';

export async function getMember(memberId: string): Promise<MemberPublic> {
  return apiClient.get<MemberPublic>(`/api/v2/members/${memberId}`);
}

export async function updateMember(memberId: string, data: MemberUpdateRequest): Promise<Member> {
  return apiClient.patch<Member>(`/api/v2/members/${memberId}`, data);
}

export async function signupMember(data: MemberUpdateRequest): Promise<Member> {
  return apiClient.post<Member>('/api/v2/members/signup', data);
}

export async function getMemberFriends(memberId: string, params?: PageParams): Promise<MemberListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/v2/members/${memberId}/friends?${queryString}` : `/api/v2/members/${memberId}/friends`;

  return apiClient.get<MemberListResponse>(endpoint);
}

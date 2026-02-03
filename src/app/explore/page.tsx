'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Gift, Users, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { toast } from 'sonner';

export default function ExplorePage() {
    const router = useRouter();
    const [searchId, setSearchId] = useState('');
    const [searchedId, setSearchedId] = useState<string | null>(null);
    
    const { data: wishlist, isLoading, error } = useWishlist(searchedId || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) {
            toast.error('회원 ID를 입력해주세요');
            return;
        }
        setSearchedId(searchId.trim());
    };

    const handleViewWishlist = (memberId: string) => {
        router.push(`/wishlist/${memberId}`);
    };

    // 샘플 회원 목록 (실제 환경에서는 API로 가져와야 함)
    const sampleMembers = [
        { id: '1', nickname: '회원 1', description: '첫 번째 회원' },
        { id: '2', nickname: '회원 2', description: '두 번째 회원' },
        { id: '3', nickname: '회원 3', description: '세 번째 회원' },
        { id: '4', nickname: '회원 4', description: '네 번째 회원' },
        { id: '5', nickname: '회원 5', description: '다섯 번째 회원' },
    ];

    return (
        <AppShell>
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">위시리스트 탐색</h1>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        다른 사람들의 위시리스트를 확인하고 선물 펀딩에 참여해보세요
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-md mx-auto mb-12">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="회원 ID를 입력하세요 (예: 1, 2, 3...)"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">
                            <Search className="w-4 h-4 mr-2" />
                            검색
                        </Button>
                    </form>
                </div>

                {/* Search Result */}
                {searchedId && (
                    <div className="mb-12">
                        <h2 className="text-lg font-bold mb-4">검색 결과</h2>
                        
                        {isLoading && (
                            <Card className="p-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-16 h-16 rounded-full" />
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-32 mb-2" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {error && (
                            <Card className="p-6 text-center">
                                <p className="text-muted-foreground">
                                    회원 ID "{searchedId}"의 위시리스트를 찾을 수 없습니다
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    비공개 위시리스트이거나 존재하지 않는 회원일 수 있습니다
                                </p>
                            </Card>
                        )}

                        {wishlist && !isLoading && (
                            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewWishlist(searchedId)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                            {wishlist.member.nickname?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{wishlist.member.nickname}님의 위시리스트</h3>
                                            <p className="text-muted-foreground">
                                                {wishlist.itemCount}개의 아이템
                                            </p>
                                        </div>
                                    </div>
                                    <Button>
                                        보러가기
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>

                                {/* Preview Items */}
                                {wishlist.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-muted-foreground mb-3">위시 아이템 미리보기</p>
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                            {wishlist.items.slice(0, 6).map((item) => (
                                                <div key={item.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                                    <Image
                                                        src={item.product.imageUrl || '/images/placeholder-product.jpg'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {item.status === 'IN_FUNDING' && (
                                                        <Badge className="absolute top-1 right-1 bg-orange-500 text-[10px] px-1">펀딩중</Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                )}

                {/* Sample Members (Quick Access) */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-lg font-bold">빠른 접근</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        아래 회원들의 위시리스트를 바로 확인해보세요
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {sampleMembers.map((member) => (
                            <Card 
                                key={member.id} 
                                className="p-4 hover:shadow-lg transition-shadow cursor-pointer text-center"
                                onClick={() => {
                                    setSearchId(member.id);
                                    setSearchedId(member.id);
                                }}
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                                    {member.id}
                                </div>
                                <h3 className="font-medium text-sm">{member.nickname}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{member.description}</p>
                                <Button variant="ghost" size="sm" className="mt-3 w-full">
                                    <Gift className="w-4 h-4 mr-1" />
                                    위시리스트 보기
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-16 text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <h3 className="text-lg font-bold mb-2">💡 TIP</h3>
                    <p className="text-muted-foreground">
                        회원 ID는 백엔드 데이터베이스에서 확인할 수 있습니다.<br />
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">SELECT id, nickname FROM member;</code>
                    </p>
                </div>
            </div>

            <Footer />
        </AppShell>
    );
}

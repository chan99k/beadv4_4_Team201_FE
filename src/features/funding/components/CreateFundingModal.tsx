'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// NOTE: Creating without Calendar/Textarea first if not installed, will accept simple text for date/desc to avoid complex install steps if not needed.
// Actually, I should install textarea, calendar, popover for a good UX.
// But for now, to keep it simple and robust:
// Description: Input (or Textarea if I suspect it exists, usually not default in my bulk install list? Wait, I installed "Button, Card, Input, Avatar, Badge, Progress, Sheet, Skeleton, Separator, ScrollArea, Tabs, Dialog, DropdownMenu". Textarea, Calendar, Popover are missing.)
// I will use simple Input for now or install them.
// Let's use simple Input for description and date (HTML date input) to ensure speed.

interface CreateFundingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: {
        name: string;
        price: number;
        imageUrl: string;
    };
    onSuccess: () => void;
}

export function CreateFundingModal({
    open,
    onOpenChange,
    product,
    onSuccess
}: CreateFundingModalProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(`${product.name} 받고 싶어요!`);
    const [description, setDescription] = useState('생일 선물로 받고 싶습니다. 도와주세요!');
    const [targetAmount, setTargetAmount] = useState(product.price.toString());
    const [deadline, setDeadline] = useState(
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 2 weeks
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('펀딩이 시작되었습니다!');
            onOpenChange(false);
            onSuccess();
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>펀딩 시작하기</DialogTitle>
                    <DialogDescription>
                        친구들에게 선물을 요청해보세요.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">펀딩 제목</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="targetAmount">목표 금액</Label>
                        <Input
                            id="targetAmount"
                            type="number"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            상품 가격: {product.price.toLocaleString()}원
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="deadline">종료일</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">설명</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="친구들에게 전할 말을 적어주세요."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            시작하기
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../Footer';

describe('Footer Component', () => {
    it('renders customer service information', () => {
        render(<Footer />);
        expect(screen.getByText('1234-5678')).toBeInTheDocument();
        expect(screen.getByText('고객센터')).toBeInTheDocument();
    });

    it('renders notice section', () => {
        render(<Footer />);
        expect(screen.getByText('NOTICE')).toBeInTheDocument();
        expect(screen.getByText(/서비스 이용약관 개정 안내/)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Footer />);
        // Checking for links by role to be accessible and specific
        expect(screen.getByRole('link', { name: '회사소개' })).toBeInTheDocument();
        // Relaxing the check for ordering/delivery to just text content if link role is tricky with nested children
        expect(screen.getByRole('link', { name: '주문배송' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: '자주 묻는 질문' })).toBeInTheDocument();
    });

    it('renders social media links', () => {
        render(<Footer />);
        const instagram = screen.getByLabelText('Instagram');
        expect(instagram).toBeInTheDocument();
        expect(instagram).toHaveAttribute('href', 'https://instagram.com/giftify');
    });

    it('renders copyright', () => {
        render(<Footer />);
        expect(screen.getByText(/GIFTIFY Inc. All rights reserved./)).toBeInTheDocument();
    });
});

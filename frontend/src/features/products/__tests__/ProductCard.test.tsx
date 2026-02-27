import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

const mockProduct: Product = {
    id: 1,
    name: 'Abbey Road',
    artistName: 'The Beatles',
    coverUrl: 'http://localhost:4000/uploads/cover-test.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('ProductCard', () => {
    it('renders product name and artist name', () => {
        render(<ProductCard product={mockProduct} onDelete={vi.fn()} />);
        expect(screen.getByText('Abbey Road')).toBeDefined();
        expect(screen.getByText('The Beatles')).toBeDefined();
    });

    it('renders cover art with accessible alt text', () => {
        render(<ProductCard product={mockProduct} onDelete={vi.fn()} />);
        const img = screen.getByRole('img');
        expect(img.getAttribute('alt')).toContain('Abbey Road');
        expect(img.getAttribute('alt')).toContain('The Beatles');
    });

    it('has correct aria-label on the article', () => {
        render(<ProductCard product={mockProduct} onDelete={vi.fn()} />);
        const article = screen.getByRole('article');
        expect(article.getAttribute('aria-label')).toBe('Abbey Road by The Beatles');
    });
});

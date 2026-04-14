import '@testing-library/jest-dom';
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();
}

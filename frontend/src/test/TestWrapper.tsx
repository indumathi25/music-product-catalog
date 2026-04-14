import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../store';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});

interface TestWrapperProps {
    children: React.ReactNode;
    initialEntries?: string[];
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children, initialEntries = ['/'] }) => {
    const queryClient = createTestQueryClient();
    
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </QueryClientProvider>
        </Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const createTestWrapper = (initialEntries: string[] = ['/']) => {
    return ({ children }: { children: React.ReactNode }) => (
        <TestWrapper initialEntries={initialEntries}>
            {children}
        </TestWrapper>
    );
};

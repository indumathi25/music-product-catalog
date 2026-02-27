import { Suspense, lazy, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NotFound } from '@/components/NotFound';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy routes
const HomePage = lazy(() => import('@/pages/HomePage'));
const CreateProductPage = lazy(() => import('@/pages/CreateProductPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));

// Preload high-probability route
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        import('@/pages/CreateProductPage');
        import('@/pages/ProductDetailPage');
    });
}

const PageLoader = memo(function PageLoader() {
    return (
        <div
            className="flex min-h-screen items-center justify-center"
            aria-label="Loading page"
            role="status"
        >
            <div
                className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
                aria-hidden="true"
            />
        </div>
    );
});

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Navbar />
            <main
                id="main-content"
                tabIndex={-1}
                className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
            >
                {children}
            </main>
            <Footer />
        </div>
    );
}

export function App() {
    return (
        <AppLayout>
            <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create" element={<CreateProductPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </AppLayout>
    );
}
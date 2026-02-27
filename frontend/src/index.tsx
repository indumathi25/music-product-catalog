import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { store, persistor } from './store';
import { App } from './app/App';
import './styles/index.css';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            console.error('Query Error:', error.message);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            toast.error(error.message || 'Something went wrong');
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <Toaster position="top-right" />
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('[ErrorBoundary]', error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div role="alert" className="flex flex-col items-center justify-center py-24 text-center">
                        <p className="text-4xl" aria-hidden="true">⚠️</p>
                        <h2 className="mt-4 text-lg font-semibold text-gray-900">Something went wrong</h2>
                        <p className="mt-1 text-sm text-gray-500">{this.state.error?.message}</p>
                        <button
                            type="button"
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="mt-6 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                        >
                            Try again
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}

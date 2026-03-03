import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import type { ComponentType } from 'react';

function AuthLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Authenticating">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" aria-hidden="true" />
                <p className="text-sm text-gray-500 font-medium">Signing you in…</p>
            </div>
        </div>
    );
}

/**
 * Unauthenticated users are redirected to Auth0's login page.
 */
export function ProtectedRoute({ component: Component }: { component: ComponentType }) {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) {
        return <AuthLoader />;
    }

    if (!isAuthenticated) {
        loginWithRedirect({
            appState: { returnTo: window.location.pathname },
        });
        return <Navigate to="/" replace />;
    }

    return <Component />;
}

import { useNavigate } from 'react-router-dom';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import { AUTH0_CONFIG } from '../config/auth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    if (!AUTH0_CONFIG.domain || !AUTH0_CONFIG.clientId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 text-center">
                <div className="max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-red-600">Auth0 Configuration Error</h2>
                    <p className="text-sm text-gray-600">
                        Missing required Auth0 environment variables. Please check your .env file.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Auth0Provider
            domain={AUTH0_CONFIG.domain}
            clientId={AUTH0_CONFIG.clientId}
            authorizationParams={{
                redirect_uri: AUTH0_CONFIG.redirectUri,
                audience: AUTH0_CONFIG.audience,
                scope: AUTH0_CONFIG.scope,
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation={AUTH0_CONFIG.cacheLocation}
            useRefreshTokens={AUTH0_CONFIG.refreshTokens}
        >
            {children}
        </Auth0Provider>
    );
}

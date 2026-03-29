
const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        console.warn(`Missing environment variable: ${key}`);
    }
    return value || '';
};

export const AUTH0_CONFIG = {
    domain: getEnvVar('VITE_AUTH0_DOMAIN'),
    clientId: getEnvVar('VITE_AUTH0_CLIENT_ID'),
    audience: getEnvVar('VITE_AUTH0_AUDIENCE'),
    redirectUri: window.location.origin,
    scope: 'openid profile email offline_access',
    cacheLocation: 'localstorage' as const,
    refreshTokens: true,
};

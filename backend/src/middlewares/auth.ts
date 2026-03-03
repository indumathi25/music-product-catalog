import { auth } from 'express-oauth2-jwt-bearer';
import { env } from '../config/env';

/**
 * Auth0 JWT Middleware (PKCE flow)
 */
export const authMiddleware = auth({
    issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
    audience: env.AUTH0_AUDIENCE,
});

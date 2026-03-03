const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestOptions = Omit<RequestInit, 'body' | 'method'> & {
    body?: FormData | Record<string, unknown>;
    signal?: AbortSignal;
    accessToken?: string;
};

async function safeJson<T>(response: Response): Promise<T | null> {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
}

async function request<T>(
    path: string,
    method: HttpMethod = 'GET',
    options: RequestOptions = {},
): Promise<T> {
    const { body, headers, accessToken, ...rest } = options;

    const authHeaders: Record<string, string> = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

    const init: RequestInit = {
        method,
        ...rest,
        headers: {
            ...authHeaders,
            ...(body instanceof FormData
                ? headers
                : {
                    'Content-Type': 'application/json',
                    ...headers,
                }),
        },
        body:
            body instanceof FormData
                ? body
                : body
                    ? JSON.stringify(body)
                    : undefined,
    };

    let response: Response;

    try {
        response = await fetch(`${BASE_URL}${path}`, init);
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : 'Network error — check your connection';
        throw new ApiError(0, 'NETWORK_ERROR', message);
    }

    if (!response.ok) {
        const errorBody = await safeJson<{ error?: { code?: string; message?: string } }>(response);

        throw new ApiError(
            response.status,
            errorBody?.error?.code ?? 'HTTP_ERROR',
            errorBody?.error?.message ??
            `Request failed with status ${response.status}`,
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await safeJson<T>(response);
    return data as T;
}

export const apiClient = {
    get<T>(path: string, params?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
        let fullPath = path;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
            const qs = searchParams.toString();
            if (qs) {
                fullPath += `?${qs}`;
            }
        }
        return request<T>(fullPath, 'GET', { signal });
    },

    post<T>(path: string, body: FormData | Record<string, unknown>, accessToken?: string, signal?: AbortSignal): Promise<T> {
        return request<T>(path, 'POST', { body, accessToken, signal });
    },

    put<T>(path: string, body: FormData | Record<string, unknown>, accessToken?: string, signal?: AbortSignal): Promise<T> {
        return request<T>(path, 'PUT', { body, accessToken, signal });
    },

    delete(path: string, accessToken?: string, signal?: AbortSignal): Promise<void> {
        return request<void>(path, 'DELETE', { accessToken, signal });
    },
};
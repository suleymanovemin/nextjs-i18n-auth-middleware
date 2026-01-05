import type { LoginCredentials, LoginResponse, User } from '@/types/auth';

const BASE_URL = 'https://dummyjson.com';

/**
 * Helper to handle fetch responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }
    return response.json();
}

/**
 * Login user with DummyJSON API
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            expiresInMins: credentials.expiresInMins || 30,
        }),
    });

    return handleResponse<LoginResponse>(response);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return handleResponse<User>(response);
}

/**
 * Refresh authentication token
 */
export async function refreshAuthToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            refreshToken,
            expiresInMins: 30,
        }),
    });

    return handleResponse<LoginResponse>(response);
}

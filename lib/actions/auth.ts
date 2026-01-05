'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginUser, getCurrentUser } from '@/lib/api/auth';
import type { LoginCredentials } from '@/types/auth';

/**
 * Server action for login
 */
export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return {
            success: false,
            error: 'Username and password are required',
        };
    }

    try {
        const credentials: LoginCredentials = {
            username,
            password,
            expiresInMins: 30,
        };

        const response = await loginUser(credentials);

        // Set the access token in cookies
        const cookieStore = await cookies();
        cookieStore.set('accessToken', response.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 60, // 30 minutes
        });

        // Store refresh token
        cookieStore.set('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return {
            success: true,
            user: {
                id: response.id,
                username: response.username,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
            },
        };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Invalid credentials',
        };
    }
}

/**
 * Server action for logout
 */
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
}

/**
 * Verify user session (for middleware)
 */
export async function verifyUserSession(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return false;
        }

        // Verify token with DummyJSON API
        await getCurrentUser(accessToken);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Get current user data (for server components)
 */
export async function getCurrentUserData() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return null;
        }

        const user = await getCurrentUser(accessToken);
        return user;
    } catch (error) {
        return null;
    }
}

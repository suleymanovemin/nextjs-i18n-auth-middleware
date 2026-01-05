import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "az"];
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return match(languages, locales, defaultLocale);
}

/**
 * Verify user session by checking accessToken with DummyJSON API
 */
async function verifyUserSession(accessToken: string): Promise<boolean> {
    try {
        const response = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Session verification error:', error);
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Dilin URL-də olub-olmadığını yoxla
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }

    // 2. Auth Məntiqi
    const accessToken = request.cookies.get("accessToken")?.value;
    const currentLocale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

    // Qorunan yollar
    const isProtectedRoute = pathWithoutLocale.startsWith("/dashboard");
    const isAuthRoute = pathWithoutLocale.startsWith("/login");

    // Protected route - verify user session with API
    if (isProtectedRoute) {
        if (!accessToken) {
            return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
        }

        // Verify token with DummyJSON API
        const isValid = await verifyUserSession(accessToken);

        if (!isValid) {
            // Token is invalid, clear it and redirect to login
            const response = NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
        }
    }

    // Already logged in, redirect to dashboard
    if (isAuthRoute && accessToken) {
        // Verify token is still valid
        const isValid = await verifyUserSession(accessToken);

        if (isValid) {
            return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
        } else {
            // Token invalid, allow access to login page and clear cookies
            const response = NextResponse.next();
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "az"];
const defaultLocale = "en";

/**
 * Get the preferred locale based on browser headers
 * Brauzer başlıqlarına əsasən üstünlük verilən dili təyin edir
 */
function getLocale(request: NextRequest): string {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the URL already contains a supported locale
    // 1. Dilin URL-də olub-olmadığını yoxla
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If no locale is present, determine the best locale and redirect
    // Əgər dil URL-də yoxdursa, uyğun dili tap və redirect et
    if (!pathnameHasLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }

    // 2. Authentication Logic
    // 2. Autentifikasiya Məntiqi
    const token = request.cookies.get("session")?.value;
    const currentLocale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

    // Define protected and authentication-related routes
    // Qorunan və autentifikasiya ilə bağlı yolları təyin et
    const isProtectedRoute = pathWithoutLocale.startsWith("/dashboard");
    const isAuthRoute = pathWithoutLocale.startsWith("/login");

    // Redirect to login if accessing a protected route without a token
    // Giriş edilməyibsə və qorunan səhifəyə keçmək istəyirsə login-ə yönləndir
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
    }

    // Redirect to dashboard if an authenticated user tries to access login/auth pages
    // Giriş edilibsə və yenidən login səhifəsinə keçmək istəyirsə dashboard-a yönləndir
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    /**
     * Match all request paths except for internal ones (api, static, images, etc.)
     * Daxili yollar istisna olmaqla bütün yollarda middleware-i işə sal
     */
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

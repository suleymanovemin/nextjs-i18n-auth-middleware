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

export function middleware(request: NextRequest) {
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
    const token = request.cookies.get("session")?.value;
    const currentLocale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

    // Qorunan yollar
    const isProtectedRoute = pathWithoutLocale.startsWith("/dashboard");
    const isAuthRoute = pathWithoutLocale.startsWith("/login");

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
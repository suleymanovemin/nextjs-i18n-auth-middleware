# Next.js i18n & Auth Middleware Starter (TypeScript)

This project is a professional starter template built with **Next.js App Router** that combines **Internationalization (i18n)** and **Middleware-level Authentication** (Route Protection) logic.

## 🚀 Features

-   **🌍 Dynamic i18n Routing:** Automatic redirection based on the user's browser language (e.g., `/` -> `/en`).
-   **🔒 Middleware Auth:** Protects private routes like `/dashboard` by verifying credentials and redirecting unauthorized users to `/login`.
-   **🛡️ Type-Safe Dictionaries:** A fully TypeScript-compatible translation system based on JSON dictionaries.
-   **⚡ Edge Runtime:** All checks are executed via Next.js Middleware for ultra-fast performance.
-   **🎨 Tailwind CSS:** Pre-configured styling management.

## 📂 Project Structure

```text
├── app/
│   ├── [locale]/             # All pages are located inside this directory
│   │   ├── layout.tsx        # Layout that dynamically sets the HTML lang attribute
│   │   ├── page.tsx          # Home page
│   │   ├── dashboard/        # Protected (Private) page
│   │   ├── login/            # Login page
│   │   └── dictionaries.ts   # Translation Dictionary Loader
├── dictionaries/             # Translation files (JSON)
│   ├── en.json
│   └── az.json
├── middleware.ts             # Core Auth and i18n logic
└── next.config.ts            # Next.js configuration

--------------------------------------------------------------

# Next.js i18n & Auth Middleware Starter (TypeScript)

Bu layihə **Next.js App Router** istifadə edərək həm çoxdillilik (**Internationalization**), həm də **Middleware** səviyyəsində autentifikasiya (Route Protection) məntiqini özündə birləşdirən peşəkar bir şablondur.

## 🚀 Özəlliklər

-   **🌍 Dinamik i18n Routing:** İstifadəçinin brauzer dilinə uyğun olaraq avtomatik yönləndirmə (məs: `/` -> `/az`).
-   **🔒 Middleware Auth:** `/dashboard` kimi qorunan səhifələrə girişi yoxlayır və icazəsi olmayanları `/login`-ə yönləndirir.
-   **🛡️ Type-Safe Dictionaries:** TypeScript ilə tam uyumlu, JSON əsaslı tərcümə sistemi.
-   **⚡ Edge Runtime:** Bütün yoxlamalar Next.js Middleware vasitəsilə ən sürətli şəkildə həyata keçirilir.
-   **🎨 Tailwind CSS:** Stil idarəetməsi üçün hazır konfiqurasiya.

## 📂 Layihə Strukturu

```text
├── app/
│   ├── [locale]/             # Bütün səhifələr bu qovluğun daxilindədir
│   │   ├── layout.tsx        # HTML lang atributunu dinamik təyin edən layout
│   │   ├── page.tsx          # Ana səhifə
│   │   ├── dashboard/        # Qorunan (Private) səhifə
│   │   ├── login/            # Giriş səhifəsi
│   │   └── dictionaries.ts   # Tərcümə yükləyicisi (Dictionary Loader)
├── dictionaries/             # Tərcümə faylları (JSON)
│   ├── en.json
│   └── az.json
├── middleware.ts             # Əsas Auth və i18n məntiqi
└── next.config.ts            # Next.js konfiqurasiyası

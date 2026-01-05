import { LoginForm } from '@/components/auth/login-form';

interface LoginPageProps {
    params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
    const { locale } = await params;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <LoginForm locale={locale} />
        </div>
    );
}
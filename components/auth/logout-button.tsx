'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/actions/auth';

interface LogoutButtonProps {
    locale: string;
}

export function LogoutButton({ locale }: LogoutButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();

            toast.success('Logged out successfully');

            // Redirect to login page
            router.push(`/${locale}/login`);
            router.refresh();
        });
    };

    return (
        <Button
            onClick={handleLogout}
            variant="destructive"
            disabled={isPending}
        >
            {isPending ? 'Logging out...' : 'Logout'}
        </Button>
    );
}

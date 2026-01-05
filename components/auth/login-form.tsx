'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginAction } from '@/lib/actions/auth';

interface LoginFormProps {
    locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        startTransition(async () => {
            const result = await loginAction(formData);

            if (result.success) {
                toast.success('Login successful!', {
                    description: `Welcome back, ${result.user?.firstName}!`,
                });

                // Redirect to dashboard
                router.push(`/${locale}/dashboard`);
                router.refresh();
            } else {
                toast.error('Login failed', {
                    description: result.error || 'Invalid credentials',
                });
            }
        });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Logging in...' : 'Login'}
                    </Button>

                    <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <p>Username: <code className="text-xs bg-background px-1 py-0.5 rounded">emilys</code></p>
                        <p>Password: <code className="text-xs bg-background px-1 py-0.5 rounded">emilyspass</code></p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

import { redirect } from 'next/navigation';
import { getCurrentUserData } from '@/lib/actions/auth';
import { LogoutButton } from '@/components/auth/logout-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardPageProps {
    params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
    const { locale } = await params;
    const user = await getCurrentUserData();

    // If no user, redirect to login (shouldn't happen due to middleware, but safety check)
    if (!user) {
        redirect(`/${locale}/login`);
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <LogoutButton locale={locale} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, {user.firstName} {user.lastName}!</CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Username</p>
                                <p className="text-lg">{user.username}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-lg">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                                <p className="text-lg">{user.firstName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                                <p className="text-lg">{user.lastName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                                <p className="text-lg capitalize">{user.gender}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                <p className="text-lg">{user.id}</p>
                            </div>
                        </div>

                        {user.image && (
                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium text-muted-foreground mb-2">Profile Picture</p>
                                <img
                                    src={user.image}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
import { getDictionary, Locale } from "./dictionaries";


interface DashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{dict.auth.welcome}</h1>
      <p className="mt-4">Dil: {locale.toUpperCase()}</p>
    </div>
  );
}
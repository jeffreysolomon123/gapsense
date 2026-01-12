// app/dashboard/search/[id]/page.tsx
import SearchDetailsClient from './SearchDetailsClient';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return <SearchDetailsClient id={resolvedParams.id} />;
}
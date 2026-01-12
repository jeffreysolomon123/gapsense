import SearchDetailsClient from './SearchDetailsClient';
import { cookies } from 'next/headers'; // Import this

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Calling cookies() or headers() forces the page into dynamic rendering
    // without using the 'export const dynamic' syntax.
    await cookies(); 
    
    const resolvedParams = await params;
    return <SearchDetailsClient id={resolvedParams.id} />;
}
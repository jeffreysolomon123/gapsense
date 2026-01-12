import { Suspense } from 'react';
import SearchDetailsClient from './SearchDetailsClient';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Calling cookies() ensures the page is dynamic
    await cookies(); 
    const resolvedParams = await params;

    return (
        <Suspense fallback={<SearchLoading />}>
            <SearchDetailsClient id={resolvedParams.id} />
        </Suspense>
    );
}

// Simple internal loading state for the Suspense boundary
function SearchLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F9FBFB]">
            <div className="animate-pulse text-[#215E61] font-medium">
                Loading Analysis...
            </div>
        </div>
    );
}
'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { useParams } from 'next/navigation';
import { BookOpen, Calendar, ExternalLink, Loader2, FileText, ChevronRight } from 'lucide-react';
import ReactMarkdown from "react-markdown";

export default function SearchDetailsPage() {
    const params = useParams();
    const id = params.id;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from('searches')
                .select('*')
                .eq('id', id)
                .single();

            if (!error) setData(data);
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-[#F9FBFB]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-[#215E61] animate-spin" />
                <p className="text-[#215E61] font-medium animate-pulse">Retrieving Analysis...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FBFB]">
            <p className="text-red-500 font-medium">Report not found.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FBFB] text-slate-800 p-4 md:p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb-style Header */}
                <div className="flex items-center gap-2 text-[#215E61]/60 text-xs font-bold uppercase tracking-widest mb-6">
                    <span>Dashboard</span>
                    <ChevronRight size={12} />
                    <span>Archive</span>
                    <ChevronRight size={12} />
                    <span className="text-[#215E61]">Report #{id?.toString().slice(0, 8)}</span>
                </div>

                {/* Main Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-2 text-[#215E61] mb-3">
                        <Calendar size={16} />
                        <span className="text-sm font-semibold">
                            {new Date(data.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a3a3a] leading-tight mb-6">
                        {data.query}
                    </h1>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                        {data.keywords?.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-[#215E61]/5 border border-[#215E61]/20 text-[#215E61] text-[11px] font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[#215E61]/10 rounded-2xl bg-white shadow-sm overflow-hidden">
                        <div className="p-5 border-r border-b sm:border-b-0 border-[#215E61]/10">
                            <p className="text-[10px] uppercase tracking-widest text-[#215E61]/60 font-black mb-1">Domain</p>
                            <p className="text-sm font-bold text-slate-700">{data.domain}</p>
                        </div>
                        <div className="p-5 border-r border-b sm:border-b-0 border-[#215E61]/10">
                            <p className="text-[10px] uppercase tracking-widest text-[#215E61]/60 font-black mb-1">Category</p>
                            <p className="text-sm font-bold text-slate-700">{data.category}</p>
                        </div>
                        <div className="p-5">
                            <p className="text-[10px] uppercase tracking-widest text-[#215E61]/60 font-black mb-1">Methodology</p>
                            <p className="text-sm font-mono text-slate-500">{data.model}</p>
                        </div>
                    </div>
                </header>

                <main className="space-y-10">
                    {/* Report Content */}
                    <article className="bg-white border border-[#215E61]/10 rounded-[32px] p-8 md:p-12 shadow-sm relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <FileText size={200} />
                        </div>

                        <div className="prose prose-slate max-w-none prose-headings:text-[#215E61] prose-headings:font-bold prose-strong:text-[#215E61] prose-a:text-[#215E61]">
                            <ReactMarkdown
                                components={{
                                    h1: ({...props}) => <h1 className="text-3xl mb-6 border-b pb-4 border-[#215E61]/10" {...props} />,
                                    h2: ({...props}) => <h2 className="text-2xl mt-10 mb-4" {...props} />,
                                    h3: ({...props}) => <h3 className="text-xl mt-8 mb-3" {...props} />,
                                    p: ({...props}) => <p className="text-slate-600 leading-relaxed mb-6" {...props} />,
                                    ul: ({...props}) => <ul className="list-disc pl-5 space-y-3 mb-6" {...props} />,
                                    li: ({...props}) => <li className="text-slate-600" {...props} />,
                                    hr: () => <hr className="my-10 border-[#215E61]/10" />,
                                }}
                            >
                                {data.result}
                            </ReactMarkdown>
                        </div>
                    </article>

                    {/* Sources Section */}
                    <section className="pb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#215E61] rounded-lg text-white">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1a3a3a] uppercase tracking-tight">Source Material (arXiv)</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.arxiv_links?.map((link: string, i: number) => (
                                <a 
                                    key={i} 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 rounded-xl bg-white border border-[#215E61]/10 hover:border-[#215E61] hover:shadow-md transition-all"
                                >
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-[10px] font-bold text-[#215E61]/50 uppercase">Reference {i + 1}</span>
                                        <span className="text-xs font-mono text-slate-500 group-hover:text-[#215E61] truncate">
                                            {link.split('/').pop()}
                                        </span>
                                    </div>
                                    <ExternalLink size={14} className="text-[#215E61]/30 group-hover:text-[#215E61] transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
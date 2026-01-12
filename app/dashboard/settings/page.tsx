'use client'
import React, { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { 
    User, 
    Mail, 
    CreditCard, 
    BarChart3, 
    ChevronRight, 
    ShieldCheck, 
    Zap,
    ArrowUpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [search_count, setSearchCount] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [plan, setPlan] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                setLoading(false);
                return;
            }

            setEmail(user.email ?? null);

            // Fetching usage and plan in parallel
            const [usageRes, planRes] = await Promise.all([
                supabase.from('usage').select('search_count').eq('user_id', user.id).single(),
                supabase.from('user_plans').select('plan').eq('user_id', user.id).single()
            ]);

            if (!usageRes.error) setSearchCount(usageRes.data?.search_count);
            if (!planRes.error) setPlan(planRes.data?.plan);
            
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const limit = 3; // Your free tier limit
    const percentage = search_count ? Math.min((search_count / limit) * 100, 100) : 0;

    if (loading) return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#F9FBFB]">
            <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-[#215E61] border-t-transparent animate-spin" />
                <p className="text-[#215E61] text-xs font-bold uppercase tracking-widest">Loading Account...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FBFB] p-5 md:p-8 lg:p-10">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-[#1a3a3a] mb-2">Account Settings</h1>
                    <p className="text-slate-500 text-sm">Manage your profile, usage limits, and research plan.</p>
                </header>

                <div className="space-y-6">
                    
                    {/* Profile Card */}
                    <div className="bg-white border border-[#215E61]/10 rounded-md p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-full bg-[#215E61]/5 flex items-center justify-center text-[#215E61]">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-[#215E61]/40 uppercase tracking-widest">User Identity</h2>
                                <p className="text-slate-700 font-bold">{email}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-500">
                                <ShieldCheck size={16} className="text-green-600" />
                                <span className="text-xs font-medium">Verified Email</span>
                            </div>
                            {/* <div className="flex items-center gap-3 text-slate-500">
                                <Mail size={16} />
                                <span className="text-xs font-medium">Email Verified</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Usage & Plan Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Usage Card */}
                        <div className="bg-white border border-[#215E61]/10 rounded-md p-6 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-[#215E61]">
                                    <BarChart3 size={18} />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest">Usage Meter</h3>
                                </div>
                                <span className="text-xs font-bold text-[#1a3a3a]">{search_count} / {limit}</span>
                            </div>
                            
                            <div className="mt-auto">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-3 overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${percentage >= 100 ? 'bg-red-500' : 'bg-[#215E61]'}`} 
                                        style={{ width: `${percentage}%` }} 
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {percentage >= 100 
                                        ? "Limit reached. Upgrade for more." 
                                        : `${limit - (search_count || 0)} free searches remaining.`}
                                </p>
                            </div>
                        </div>

                        {/* Plan Card */}
                        <div className="bg-[#215E61] rounded-md p-6 shadow-md text-white flex flex-col">
                            <div className="flex items-center gap-2 mb-4 opacity-80">
                                <CreditCard size={18} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest">Current Tier</h3>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-2xl font-semibold capitalize tracking-tight">{plan || 'Free Tier'}</p>
                                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter"></p>
                                </div>
                                <Link 
                                    href="/dashboard/request-searches"
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                                >
                                    <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4">
                        <h3 className="text-[10px] font-black text-[#215E61]/40 uppercase tracking-widest mb-4">HELP</h3>
                        <div className="space-y-3">
                            <Link 
                                href="/dashboard/request-searches" 
                                className="flex items-center justify-between p-4 bg-white border border-[#215E61]/10 rounded-md hover:border-[#215E61]/40 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <ArrowUpCircle size={20} className="text-[#215E61]" />
                                    <span className="text-sm font-bold text-[#1a3a3a]">Request Search Credits</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#215E61] transition-all" />
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Footer Info */}
                {/* <footer className="mt-12 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        GapSense Research Protocol v1.0
                    </p>
                </footer> */}
            </div>
        </div>
    );
}
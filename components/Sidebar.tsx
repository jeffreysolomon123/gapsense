"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Settings, PanelLeft, LogOut, Sparkles, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from 'next/image';
import logo from "../app/logo-white.png"

type SearchHistory = {
    id: string;
    query: string;
    created_at: string;
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [searches, setSearches] = useState<SearchHistory[]>([]);
    const [credits, setCredits] = useState<number | null>(null);
    
    const router = useRouter();
    const pathname = usePathname();

    // Fixed: Define logic for active states outside of the JSX
    const isSettingsActive = pathname === '/dashboard/settings';
    const isRequestActive = pathname === '/dashboard/request-searches';

    const slideTransition = {
        type: "tween" as const,
        ease: [0.4, 0, 0.2, 1] as const,
        duration: 0.25
    };

    useEffect(() => {
        if (isMobile && isOpen) setIsOpen(false);
    }, [pathname, isMobile]);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [usageRes, searchRes] = await Promise.all([
                supabase.from('usage').select('search_count').eq('user_id', user.id).single(),
                supabase.from('searches').select('id, query, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
            ]);

            if (usageRes.data) setCredits(usageRes.data.search_count);
            if (searchRes.data) setSearches(searchRes.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setIsOpen(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? "260px" : "0px",
                    x: isMobile && !isOpen ? -260 : 0
                }}
                transition={slideTransition}
                className="fixed inset-y-0 left-0 lg:relative z-50 bg-[#215E61] flex flex-col border-r border-white/10 overflow-hidden"
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-5 shrink-0">
                    
                    <div className="flex justify-center mb-3">
            <Link href="/dashboard" className="flex items-center gap-1 mt-3">
                <Image className="w-8 h-8"
                  src={logo}
                  alt="GapSense Logo"
                />
            </Link>
          </div>
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                            <PanelLeft size={16} />
                        </button>
                    )}
                </div>

                {/* Primary Action */}
                <div className="px-4 mb-4 shrink-0">
                    <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-[#F5FBE6] text-[#215E61] hover:bg-white transition-all text-[11px] font-bold uppercase tracking-wider">
                        <Plus size={14} strokeWidth={3} />
                        New Analysis
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
                    <p className="px-3 py-4 text-[11px] font-bold text-white/30">Recent Searches</p>
                    
                    {searches.map((item) => {
                        const isActive = pathname === `/dashboard/search/${item.id}`;
                        return (
                            <Link 
                                key={item.id} 
                                href={`/dashboard/search/${item.id}`}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all group
                                ${isActive ? 'bg-white/10 border-l-2 border-white' : 'hover:bg-white/5 border-l-2 border-transparent'}`}
                            >
                                <MessageSquare size={13} className={isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'} />
                                <span className={`text-[12px] truncate ${isActive ? 'text-white font-medium' : 'text-white/50 group-hover:text-white/80'}`}>
                                    {item.query || "Untitled"}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 bg-black/5 border-t border-white/5 space-y-3 shrink-0">
                    
                    {/* Usage Card */}
                    <div className="px-3 py-3 rounded-md bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">Usage</span>
                            <span className="text-[10px] font-medium text-white/90 uppercase tracking-tighter">{credits ?? 0} / 3</span>
                        </div>
                        <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(((credits ?? 0) / 3) * 100, 100)}%` }}
                                transition={slideTransition}
                                className="h-full bg-white/80"
                            />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <Link 
                            href="/dashboard/request-searches" 
                            className={`flex items-center gap-3 px-3 py-2 mb-2 text-[12px] rounded-md transition-all 
                            ${isRequestActive ? 'bg-white/10 text-white border-l-2 border-white' : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}
                        >
                            <Gift  size={14} />
                            <span>Request More Searches</span>
                        </Link>
                        <Link 
                            href="/dashboard/settings" 
                            className={`flex items-center gap-3 px-3 py-2 text-[12px] rounded-md transition-all 
                            ${isSettingsActive ? 'bg-white/10 text-white border-l-2 border-white' : 'text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}
                        >
                            <Settings size={14} />
                            <span>Settings</span>
                        </Link>
                        
                        <button 
                            onClick={logout} 
                            className="flex items-center gap-3 px-3 py-2 w-full text-[12px] text-white/30 hover:text-white hover:bg-red-400/10 rounded-md transition-all text-left border-l-2 border-transparent"
                        >
                            <LogOut size={14} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Toggle Trigger */}
            <AnimatePresence>
                {!isOpen && isMobile && (
                    <motion.button
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={slideTransition}
                        onClick={() => setIsOpen(true)}
                        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-[#215E61] text-white border border-white/10 shadow-lg"
                    >
                        <PanelLeft size={18} />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
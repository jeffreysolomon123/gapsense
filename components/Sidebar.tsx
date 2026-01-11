// src/components/Sidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Settings, PanelLeft, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
    const logout = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/auth/login");
    };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setIsOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Define a consistent, smooth transition
  const smoothTransition = {
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
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
            transition={{ duration: 0.2 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-[#215E61]/20 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isOpen ? (isMobile ? "280px" : "260px") : "0px",
          x: isMobile && !isOpen ? -280 : 0
        }}
        // APPLY THE SMOOTH TWEEN HERE
        transition={smoothTransition}
        className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        } bg-[#121212] flex flex-col border-r border-[#215E61]/20 overflow-hidden shrink-0 shadow-2xl`}
      >
        {/* Sidebar Content */}
              <Link href="/" className="hover:opacity-80 transition-opacity text-left ml-6 mt-6 mb-4 block">
                  <h2 className="text-xl font-bold tracking-tighter text-[#F5FBE6]">GapSense</h2>
              </Link>
        <div className="p-4">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#215E61] text-[#F5FBE6] hover:bg-[#1a4a4d] transition-all font-semibold border border-[#215E61]/20">
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-sm">New Analysis</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          <p className="px-3 py-4 text-[10px] font-bold text-[#215E61] uppercase tracking-[0.2em]">Recent History</p>
          {[1, 2, 3, 4, 5].map((item) => (
            <button key={item} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#215E61]/10 group transition-colors text-left">
              <MessageSquare size={18} className="shrink-0 text-[#215E61]/50 group-hover:text-[#215E61]" />
              <span className="text-sm truncate text-gray-400 group-hover:text-[#F5FBE6]">Research Gap Analysis {item}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#215E61]/10 bg-black/20 space-y-1">
          <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-400 hover:text-[#F5FBE6] transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button onClick={logout} className="flex items-center gap-3 w-full p-2.5 rounded-lg text-red-400/80 hover:text-red-400 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </motion.aside>

      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-[#215E61] text-[#F5FBE6] shadow-xl hover:bg-[#1a4a4d] transition-all border border-white/10"
          >
            <PanelLeft size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
// src/app/protected/layout.tsx
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import { MessageCircleHeart } from 'lucide-react';


// src/app/protected/layout.tsx
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#171717] overflow-hidden">
      <Sidebar />

      {/* The main area has your specific brand color background */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F9FBFB] relative">
        <nav className="w-full flex justify-center border-b border-[#215E61]/10 h-16 shrink-0 z-30 bg-[#F9FBFB] backdrop-blur-md">
          <div className="w-full px-6 flex justify-end gap-6 lg:justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity ">
              <h2 className="text-xl font-bold tracking-tighter text-[#215E61]">GapSense</h2>
            </Link>
            <Link href="/dashboard/feedback" className="hidden lg:inline-flex hover:opacity-80 rounded-md transition-opacity bg-[#215E61] p-1.5 px-4 flex flex-row items-center gap-2">
             <MessageCircleHeart className="text-[#ffffff] size-5" />
              <h2 className="text-sm tracking-tighter text-[#ffffff]">Feedback</h2>
              
            </Link>
            {/* <div className="flex items-center gap-4">
               <Suspense fallback={<div className="h-8 w-20 bg-[#215E61]/10 animate-pulse rounded-full" />}>
                  <AuthButton />
               </Suspense>
            </div> */}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Centering the children properly */}
          <div className="max-w-full  px-6 py-12 md:py-5 min-h-full flex flex-col justify-center">
            <div className="w-full">
              {children}
            </div>
            
            {/* <footer className="pb-10 text-center">
              <p className="text-xs font-semibold text-[#215E61] opacity-40 uppercase tracking-widest">
                GapSense.xyz
              </p>
            </footer> */}
          </div>
        </div>
      </main>
    </div>
  );
}
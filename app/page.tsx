import { Search, Zap, Microscope, BookOpen, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#F9FBFB] text-[#1a3a3a]">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#215E61]/10 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#215E61] p-1.5 rounded-lg">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter uppercase">GapSense</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Hidden on Mobile: Sign In */}
            <Link 
              href="/auth/login" 
              className="hidden sm:block text-xs font-bold uppercase tracking-widest text-[#215E61] hover:opacity-70 transition-opacity"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/sign-up" 
              className="bg-[#215E61] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#1a4a4d] transition-all shadow-md shadow-[#215E61]/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#215E61] mb-6 bg-[#215E61]/5 px-3 md:px-4 py-1.5 rounded-full">
            <Zap size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">#1 Research Gap Finder</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.2] md:leading-[1.1]">
            Identify the <span className="text-[#215E61]">Research Gaps</span> <br className="hidden md:block" /> 
            that matter.
          </h1>
          
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            GapSense deploys <strong>Advanced AI Intelligence</strong> to perform deep-dives into the most relevant literature, synthesizing unexplored territories in your field.
          </p>

          {/* Fake Search Bar - Responsive adjustments */}
          <Link href="/auth/login" className="relative max-w-2xl mx-auto block group">
            <div className="flex items-center bg-white border border-[#215E61]/20 rounded-xl p-1.5 md:p-2 shadow-xl shadow-[#215E61]/5 group-hover:border-[#215E61]/40 transition-all">
              <div className="pl-3 md:pl-4 text-slate-400">
                <Search size={18} className="md:w-5 md:h-5" />
              </div>
              <input 
                readOnly
                placeholder="Describe your research topic..."
                className="w-full bg-transparent px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
              />
              <div className="bg-[#215E61] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 group-hover:bg-[#1a4a4d] transition-all shrink-0">
                <span className="hidden xs:block">Analyze</span> <ArrowRight size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
          </Link>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2"><BookOpen size={14}/> Top 10 Contextual Papers</span>
            <span className="flex items-center gap-2"><Zap size={14} fill="currentColor"/> Automated Synthesis</span>
          </div>
        </div>
      </section>

      {/* --- Value Proposition Grid --- */}
      <section className="bg-white py-16 md:py-24 border-y border-[#215E61]/5 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <div className="w-10 h-10 bg-[#215E61]/5 text-[#215E61] flex items-center justify-center rounded-lg mx-auto md:mx-0">
              <Target size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#1a3a3a]">Precision Mapping</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Our AI pinpoints exactly where current literature stops and new opportunities begin.</p>
          </div>
          
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <div className="w-10 h-10 bg-[#215E61]/5 text-[#215E61] flex items-center justify-center rounded-lg mx-auto md:mx-0">
              <Zap size={20} fill="currentColor" />
            </div>
            <h3 className="font-bold text-lg text-[#1a3a3a]">Advanced Synthesis</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Going beyond simple summaries to actively cross-reference findings across the most relevant studies.</p>
          </div>

          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <div className="w-10 h-10 bg-[#215E61]/5 text-[#215E61] flex items-center justify-center rounded-lg mx-auto md:mx-0">
              <Zap size={20} fill="currentColor" />
            </div>
            <h3 className="font-bold text-lg text-[#1a3a3a]">Instant Clarity</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Skip the literature review fatigue. Get a high-level summary of research gaps in seconds.</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Zap size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">GapSense © 2026</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium text-center md:text-left">
            Developed by <span className="text-slate-900 font-bold">Jeffrey Solomon</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

const Target = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
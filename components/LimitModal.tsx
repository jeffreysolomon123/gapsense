import Link from "next/link";
import { AlertCircle, ArrowRight, Lock } from "lucide-react";

export function LimitModal({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-[#215E61]/10 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative Header */}
        <div className="bg-[#215E61]/5 p-8 flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <Lock className="text-[#215E61] h-8 w-8" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-xl font-extrabold text-[#1a3a3a] mb-2">
            Search Limit Reached
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            You've reached the free search limit for your account. 
            Request additional credits to continue discovering hidden research gaps.
          </p>

          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/request-searches"
              className="flex items-center justify-center gap-2 bg-[#215E61] hover:bg-[#1a4a4d] text-white font-bold py-3 px-6 rounded-md transition-all group"
            >
              Request More Searches
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={() => window.location.reload()} 
              className="text-[11px] font-bold text-[#215E61]/60 uppercase tracking-widest hover:text-[#215E61] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
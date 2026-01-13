'use client'
import React, { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Zap, Target, BookOpen, Send, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function RequestSearchesPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        amount: '5',
        purpose: '',
        topic: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('credit_requests')
            .insert([{
                user_id: user?.id,
                requested_amount: parseInt(formData.amount),
                purpose: formData.purpose,
                topic_context: formData.topic,
                status: 'pending'
            }]);

        if (!error) setSubmitted(true);
        else alert(error.message);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F9FBFB] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-[#215E61]/10 rounded-md p-10 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-[#215E61]/10 text-[#215E61] mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a3a3a] mb-2">Request Submitted</h2>
                    <p className="text-slate-500 mb-8 text-sm leading-relaxed">Your requisition for {formData.amount} additional searches is being reviewed by the GapSense team.</p>
                    <Link href="/dashboard" className="block w-full py-4 bg-[#215E61] text-white rounded-md font-bold hover:bg-[#1a4a4d] transition-all text-center">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FBFB] p-0 md:p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                {/* <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#215E61] text-xs font-bold uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity">
                    <ChevronLeft size={14} /> Back
                </Link> */}

                <header className="mb-6">
                    <div className="flex items-center gap-2 text-[#215E61] mb-3">
                        <Zap size={20} fill="currentColor" />
                        <span className="text-sm font-bold uppercase tracking-widest">More Searches</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1a3a3a] mb-3">Request Additional Analyses</h1>
                    <p className="text-slate-500">Need more deep-dives? Tell us about your research project to increase your search quota.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white border border-[#215E61]/10 rounded-md p-8 md:p-7 shadow-sm space-y-7">
                    
                    {/* Credit Amount Selector */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">Desired Quota Increase</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['5', '10', '25'].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setFormData({...formData, amount: num})}
                                    className={`py-4 rounded-md border-2 transition-all font-bold ${
                                        formData.amount === num 
                                        ? "border-[#215E61] bg-[#215E61]/5 text-[#215E61]" 
                                        : "border-slate-100 text-slate-400 hover:border-slate-200"
                                    }`}
                                >
                                    +{num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic Context */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                            <BookOpen size={12} /> Primary Research Topic
                        </label>
                        <input 
                            required
                            type="text"
                            value={formData.topic}
                            onChange={(e) => setFormData({...formData, topic: e.target.value})}
                            placeholder="e.g. LLM Reasoning Gaps in Healthcare"
                            className="w-full bg-[#F9FBFB] border text-[#181818] border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 transition-all"
                        />
                    </div>

                    {/* Purpose Statement */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                            <Target size={12} /> Reason for request
                        </label>
                        <textarea 
                            required
                            rows={4}
                            value={formData.purpose}
                            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                            placeholder="Briefly explain why you need more searches (e.g. Dissertation research, Market analysis...)"
                            className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 transition-all resize-none"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#215E61] text-white py-4 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#1a4a4d] transition-all shadow-lg shadow-[#215E61]/10"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Submit Requisition</>}
                    </button>
                </form>

                {/* <footer className="mt-8 text-center">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
                        Standard review time: 24-48 hours
                    </p>
                </footer> */}
            </div>
        </div>
    );
}
'use client'
import React, { useState,useEffect } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Send, MessageSquare, User, Building2, Beaker, AlertCircle, Loader2, CheckCircle2, ChevronDown,MessageSquareText  } from 'lucide-react';

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userId, setUserId] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        user_id : '',
        institution: '',
        occupation: '',
        domain: '',
        feedback_type: 'Feature Request',
        priority: 'Medium',
        message: ''
    });

    useEffect(() => {
    const getUserData = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();


        
        if (user) {
            setUserId(user.id)
            setFormData(prev => ({
                ...prev,
                // Assuming 'full_name' is in user_metadata
                name: user.user_metadata?.full_name || '', 
                user_id : user.id
            }));
        }
    };
    getUserData();
}, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient();
        
        const { error } = await supabase
            .from('feedback')
            .insert([formData]);

        if (!error) {
            setSubmitted(true);
        } else {
            alert("Error sending feedback: " + error.message);
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F9FBFB] flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-[#215E61]/10 rounded-md p-10 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-green-50 text-green-600 mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a3a3a] mb-2">Message Received</h2>
                    <p className="text-slate-500 mb-8">Thank you for helping us bridge more research gaps. Your insights are invaluable to the GapSense mission.</p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="w-full py-4 bg-[#215E61] text-white rounded-md font-bold hover:bg-[#1a4a4d] transition-all"
                    >
                        Send Another Note
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FBFB] p-4 md:p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 text-left">
                    <div className="inline-flex items-center gap-2 text-[#215E61] mb-3 py-1.5 rounded-full">
                        <MessageSquareText  size={16} />
                        <span className="text-sm font-bold uppercase tracking-widest">Feedback</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1a3a3a] mb-4">How can we improve GapSense?</h1>
                    <p className="text-slate-500 max-w-5xl mx-auto">Help us refine our gap-detection algorithms and researcher experience by sharing your professional observations.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white border border-[#215E61]/10 rounded-md p-8 md:p-10 shadow-sm space-y-8">
                    
                    {/* Section 1: Identity & Context */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-[#215E61] uppercase tracking-widest border-b border-[#215E61]/10 pb-2">Research Profile</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    <User size={12} /> Full Name
                                </label>
                                <input 
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Dr. Alex Rivera"
                                    className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    <Building2 size={12} /> Institution
                                </label>
                                <input 
                                    required
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                                    placeholder="e.g. Stanford University"
                                    className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    <Beaker size={12} /> Research Domain
                                </label>
                                <input 
                                    required
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                                    placeholder="e.g. Molecular Biology / LLMs"
                                    className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    <User size={12} /> Role
                                </label>
                                <select 
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                                    className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="PhD Researcher">PhD / Graduate Researcher</option>
                                    <option value="Faculty">Academic Faculty</option>
                                    <option value="RnD">Industrial R&D</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Feedback Details */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-[#215E61] uppercase tracking-widest border-b border-[#215E61]/10 pb-2">Feedback Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    <AlertCircle size={12} /> Feedback Type
                                </label>
                                <select 
                                    value={formData.feedback_type}
                                    onChange={(e) => setFormData({...formData, feedback_type: e.target.value})}
                                    className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
                                >
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="Data Accuracy">Data Accuracy Issue</option>
                                    <option value="UX Improvement">UX / Design Feedback</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                    Priority Level
                                </label>
                                <div className="flex gap-2">
                                    {['Low', 'Medium', 'High'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({...formData, priority: p})}
                                            className={`flex-1 py-3 text-[10px] font-bold uppercase rounded-md border transition-all ${
                                                formData.priority === p 
                                                ? 'bg-[#215E61] text-white border-[#215E61]' 
                                                : 'bg-transparent text-[#215E61]/40 border-[#215E61]/10 hover:border-[#215E61]/30'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                <MessageSquare size={12} /> Detailed Description
                            </label>
                            <textarea 
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="Please describe the gap or issue in detail. For data accuracy, mention specific papers if possible..."
                                className="w-full text-[#181818] bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all resize-none"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#215E61] text-white py-4 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#1a4a4d] transition-all shadow-lg shadow-[#215E61]/10 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={16} /> Submit Feedback</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
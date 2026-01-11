'use client'
import React, { useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Send, MessageSquare, User, Mail, Tag, Loader2, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Feature Request',
        message: ''
    });

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
                    <p className="text-slate-500 mb-8">Thank you for helping us bridge more research gaps. We'll review your feedback shortly.</p>
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
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-2 text-[#215E61] mb-3">
                        <MessageSquare size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Feedback </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#1a3a3a] mb-4">How can we improve GapSense?</h1>
                    <p className="text-slate-500">Your insights help us refine our gap-detection algorithms and user experience.</p>
                </header>

                <form onSubmit={handleSubmit} className="bg-white border border-[#215E61]/10 rounded-md p-8 md:p-10 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                <User size={12} /> Full Name
                            </label>
                            <input 
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Dr. Jane Smith"
                                className="w-full bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                            <Tag size={12} /> Occupation
                        </label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 appearance-none"
                        >
                            <option value="" disabled>Select your role</option>
            <option value="Undergraduate">Undergraduate Student</option>
            <option value="PhD Researcher">PhD / Graduate Researcher</option>
            <option value="Faculty">Academic Faculty / Professor</option>
            <option value="RnD">R&D / Industrial Researcher</option>
            <option value="Policy">Policy / Strategy Analyst</option>
            <option value="Other">Other Professional</option>
                        </select>
                    </div>

                        {/* Email Input */}
                        {/* <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="jane@university.edu"
                                className="w-full bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 transition-all"
                            />
                        </div> */}
                    </div>

                    {/* Category Select */}
                    

                    {/* Message Textarea */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                            <MessageSquare size={12} /> Your Feedback
                        </label>
                        <textarea 
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            placeholder="I noticed the AI report was missing references to..."
                            className="w-full bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#215E61]/20 transition-all resize-none"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full bg-[#215E61] text-white py-4 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#1a4a4d] transition-all shadow-lg shadow-[#215E61]/10 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Message</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
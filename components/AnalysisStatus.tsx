"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Check, ExternalLink, BookOpen, FileText, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";
import { LimitModal } from "./LimitModal";

interface AnalysisSectionProps {
  query: string;
}

export function AnalysisSection({ query }: AnalysisSectionProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [status, setStatus] = useState("analyzing");
  const [currentStep, setCurrentStep] = useState(0);
  const [finalReport, setFinalReport] = useState("");
  const [paperLinks, setPaperLinks] = useState<string[]>([]);
  const [search_count, setSearch_count] = useState<number>(0);
  
  const socketRef = useRef<WebSocket | null>(null);
  const supabase = createClient();

  const steps = [
    "Understanding your topic",
    "Collecting relevant papers",
    "Analyzing research trends",
    "Identifying hidden gaps",
    "Generating your report",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  async function startAnalysis(id: string) {
    try {
      const { data, error } = await supabase
        .from('usage')
        .select('search_count')
        .eq('user_id', userId)
        .single();
      // setSearch_count(data?.search_count || 0);
      // console.log("Usage data:", search_count, error);
      if (data?.search_count >= 3) {
        setShowLimitModal(true); // Show modal instead of alert
        setStatus("error");
        return;
      }


      if (error || !data) {
        alert("Error checking usage: " + (error?.message || "No data"));
        setStatus("error");
        return;
      }
      await fetch("http://localhost:8000/start-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connection_id: id,
          query: query,
          user_id: userId
        }),
      });
    } catch (e) {
      console.error("POST failed", e);
    }
  }

  useEffect(() => {
    if (socketRef.current || authLoading || !userId) return;

    setCurrentStep(0);
    setFinalReport("");
    setStatus("analyzing");

    const ws = new WebSocket("ws://localhost:8000/ws");
    socketRef.current = ws;

    ws.onmessage = (e) => {
      const msg = e.data;
      if (msg.startsWith("ERROR::")) {
        alert("Server error: " + msg.replace("ERROR::", ""));
        return;
      }
      if (msg.startsWith("ID::")) {
        startAnalysis(msg.replace("ID::", ""));
        return;
      }
      if (msg.startsWith("LINKS::")) {
        setPaperLinks(JSON.parse(msg.replace("LINKS::", "")));
        return;
      }
      if (msg.startsWith("REPORT::")) {
        setFinalReport(prev => prev + msg.replace("REPORT::", ""));
        return;
      }
      if (msg === "DONE") {
        setCurrentStep(steps.length);
        setStatus("completed");
        ws.close();
        return;
      }

      const idx = steps.indexOf(msg);
      if (idx !== -1) setCurrentStep(idx + 1);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userId, authLoading]);

  const progress = Math.min((currentStep / steps.length) * 100, 100);

  const SourcesGrid = () => (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#215E61] rounded-md text-white">
          <BookOpen size={20} />
        </div>
        <h3 className="text-lg font-bold text-[#1a3a3a] uppercase tracking-tight">
          Source Material (arXiv)
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paperLinks.map((link, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-md bg-white border border-[#215E61]/10 hover:border-[#215E61]/40 transition-all shadow-sm"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-[#215E61]/50 uppercase">
                Reference {i + 1}
              </span>
              <span className="text-xs font-mono text-slate-500 group-hover:text-[#215E61] truncate">
                {link.split('/').pop()}
              </span>
            </div>
            <ExternalLink size={14} className="text-[#215E61]/30 group-hover:text-[#215E61] transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );

  if (authLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#F9FBFB]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-[#215E61] animate-spin" />
        <p className="text-[#215E61] font-medium animate-pulse">Verifying session...</p>
      </div>
    </div>
  );

  if (!userId) return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[#F9FBFB]">
      <p className="text-red-500 font-medium">Please log in via Supabase to start analysis.</p>
    </div>
  );

  if (status === "analyzing") {
    return (
      <div className="min-h-screen bg-[#F9FBFB] p-5 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#215E61]/10 rounded-md p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#215E61]/5 rounded-full">
                <Loader2 className="h-6 w-6 text-[#215E61] animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1a3a3a]">GapSense Analysis in Progress</h3>
                <p className="text-sm text-slate-500">Synthesizing real-time research data...</p>
              </div>
            </div>

            <div className="relative h-2 bg-[#215E61]/5 rounded-full mb-10 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#215E61] transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            <div className="space-y-6">
              {steps.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={i} className="flex gap-4 items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      done ? "bg-[#215E61] text-white" : 
                      active ? "border-2 border-[#215E61] text-[#215E61] animate-pulse" : 
                      "border border-slate-200 text-slate-300"
                    }`}>
                      {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-sm font-semibold tracking-tight ${
                      done ? "text-[#215E61]" : 
                      active ? "text-[#1a3a3a]" : 
                      "text-slate-300"
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {paperLinks.length > 0 && (
              <div className="mt-10 pt-10 border-t border-[#215E61]/10">
                <SourcesGrid />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <LimitModal isOpen={showLimitModal} />
    <div className="min-h-screen bg-[#F9FBFB] text-slate-800 p-5 md:p-8 lg:p-12">
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#215E61] mb-3">
            <Calendar size={16} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a3a3a] leading-tight mb-4">
            {query}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-md bg-[#215E61]/5 border border-[#215E61]/20 text-[#215E61] text-[11px] font-bold uppercase tracking-wider">
              Live Analysis
            </span>
            <span className="px-3 py-1 rounded-md bg-[#215E61]/5 border border-[#215E61]/20 text-[#215E61] text-[11px] font-bold uppercase tracking-wider">
              {paperLinks.length} Sources
            </span>
          </div>
        </header>

        <main>
          <article className="bg-white border border-[#215E61]/10 rounded-md p-8 md:p-12 shadow-sm relative overflow-hidden mb-10">
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
                {finalReport}
              </ReactMarkdown>
            </div>
          </article>

          {paperLinks.length > 0 && <SourcesGrid />}
        </main>
      </div>
    </div>
    </>
    
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Check, ExternalLink, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/client";

export function AnalysisSection({ query }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // New loading state
  const [status, setStatus] = useState("analyzing");
  const [currentStep, setCurrentStep] = useState(0);
  const [finalReport, setFinalReport] = useState("");
  const [paperLinks, setPaperLinks] = useState<string[]>([]);
  
  const socketRef = useRef<WebSocket | null>(null);
  const supabase = createClient();

  const steps = [
    "Understanding your topic",
    "Collecting relevant papers",
    "Analyzing research trends",
    "Identifying hidden gaps",
    "Generating your report",
  ];

  // 1. Correctly fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          console.log("✅ Supabase User Found:", user.id);
        } else {
          console.log("❌ No Supabase user logged in");
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  async function startAnalysis(id: string) {
    console.log("🚀 Starting analysis for connection:", id);
    try {
      const response = await fetch("http://localhost:8000/start-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connection_id: id,
          query: query,
          user_id: userId // Passing the Supabase UUID
        }),
      });
      const data = await response.json();
      console.log("📡 Backend response:", data);
    } catch (e) {
      console.error("POST failed", e);
    }
  }

  // 2. WebSocket Logic - Changed dependency from session to userId
  useEffect(() => {
    // Only run if we have a userId and haven't started a socket yet
    if (socketRef.current || authLoading || !userId) return;

    setCurrentStep(0);
    setFinalReport("");
    setStatus("analyzing");

    console.log("🔌 Connecting to WebSocket...");
    const ws = new WebSocket("ws://localhost:8000/ws");
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WS Connected");

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
        const links = JSON.parse(msg.replace("LINKS::", ""));
        setPaperLinks(links);
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
      if (idx !== -1) {
        setCurrentStep(idx + 1);
      }
    };

    ws.onerror = (err) => console.error("WS Socket Error:", err);

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userId, authLoading]); // Trigger when userId is finally fetched

  const SourcesGrid = () => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 text-[#215E61] font-semibold">
        <BookOpen size={18} />
        <span>Sources ({paperLinks.length})</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {paperLinks.map((link, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group"
          >
            <span className="text-[10px] text-gray-400 font-medium mb-1 uppercase tracking-wider">
              ArXiv Paper {i + 1}
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#215E61] truncate font-medium">
                {link.split('/').pop()}
              </span>
              <ExternalLink size={12} className="text-gray-300 group-hover:text-[#215E61] shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  const progress = Math.min((currentStep / steps.length) * 100, 100);

  // 3. Updated render logic
  if (authLoading) return <div className="text-center mt-20 text-[#215E61]">Verifying session...</div>;
  if (!userId) return <div className="text-center mt-20 text-red-500">Please log in via Supabase to start analysis.</div>;

  if (status === "analyzing") {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 px-4">
        <div className="bg-white/80 rounded-[36px] p-8 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className="animate-spin text-[#215E61]" />
            <div>
              <h3 className="font-bold text-[#215E61]">GapSense is analyzing</h3>
              <p className="text-xs text-[#215E61]/50">Processing your query...</p>
            </div>
          </div>

          <div className="h-2 bg-[#215E61]/10 rounded-full mb-8">
            <div className="h-full bg-[#215E61] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-5 mb-8">
            {steps.map((step, i) => {
              const done = i < currentStep;
              return (
                <div key={i} className="flex gap-4 items-center">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${done ? "bg-green-500 text-white" : "border-2 border-gray-200 text-gray-400"}`}>
                    {done ? <Check size={12} /> : i + 1}
                  </div>
                  <span className={`text-sm ${done ? "text-[#215E61] font-medium" : "text-gray-400"}`}>{step}</span>
                </div>
              );
            })}
          </div>

          {paperLinks.length > 0 && (
             <div className="pt-6 border-t border-gray-100">
                <SourcesGrid />
             </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4 pb-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#215E61]">Analysis Completed 🎉</h1>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-12 text-left">
        
        <hr className="mb-8 border-gray-100" />
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#215E61] mt-8 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-[#215E61] mt-8 mb-4 " {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-[#215E61] mt-6 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4 " {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
            li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
          }}
        >
          {finalReport}
        </ReactMarkdown>
           <SourcesGrid />
      </div>
     
    </div>
  );
}
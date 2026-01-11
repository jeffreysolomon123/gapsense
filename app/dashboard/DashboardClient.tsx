"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import { AnalysisSection } from "@/components/AnalysisStatus";

export default function DashboardClient() {

  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">

      {/* Hero */}
      <div className="lg:mt-20 mt:15 self-center text-center space-y-3">
        <h2 className="text-4xl font-bold text-[#215E61] tracking-tight">
          Discover the research gaps nobody is talking about.
        </h2>
        <p className="text-[#215E61]/70 font-medium">
          #1 AI-powered research gap detection. Paste your topic or abstract to begin.
        </p>
      </div>

      {!submitted && (
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSubmit={() => setSubmitted(true)}
        />
      )}

      {submitted && (
        <AnalysisSection query={query} />
      )}
    </div>
  );
}

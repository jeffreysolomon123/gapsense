"use client";

import { ArrowUp } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: () => void;
}

export default function SearchBar({ query, setQuery, onSubmit }: SearchBarProps) {

  const limit = 200;
  const isTyping = query.length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && isTyping) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="w-full max-w-3xl px-6 flex flex-col items-center self-center bg-[#F9FBFB] rounded-2xl">

      <div className="w-full bg-white h-[35vh] lg:h-[20vh] rounded-2xl border-2 
      border-[#215E61]/20 focus-within:border-[#215E61] 
      transition-all p-4 flex flex-col">

        <textarea
          placeholder="Describe your research area..."
          value={query}
          maxLength={limit}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none 
          text-[#215E61] text-md resize-none"
        />

        <div className="flex items-center justify-between mt-2">

          <span className="text-xs text-[#215E61]/50">
            {query.length}/{limit}
          </span>

          <button
            disabled={!isTyping}
            onClick={onSubmit}
            className={`p-3 transition-all ${
              isTyping
                ? "bg-[#215E61] text-white shadow-lg hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } rounded-full`}
          >
            <ArrowUp size={20} />
          </button>

        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-6 flex gap-3 flex-wrap justify-center">
        {["Carbon footprint prediction using ML", "Edge AI for IoT devices", "Wearable sensors for real-time health monitoring"].map((topic) => (
          <button
            key={topic}
            onClick={() => setQuery(topic)}
            className="text-xs font-semibold px-4 py-2 rounded-full 
            border border-[#215E61]/20 text-[#215E61] 
            hover:bg-white transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}

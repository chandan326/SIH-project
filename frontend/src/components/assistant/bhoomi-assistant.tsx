"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, User, ShieldAlert, Sparkles } from "lucide-react";

export function BhoomiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; disclaimer?: boolean }>>([
    {
      sender: "bot",
      text: "Hello! I am Bhoomi Assistant, your geospatial land parcel AI helper. How can I assist you with survey numbers, regional land unit conversions, or due diligence procedures today?",
    },
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userText = query.trim();
    setQuery("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.response_text,
            disclaimer: data.triggered_guardrail,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I am having trouble connecting to the intelligence engine. Please try again shortly.",
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Spatial intelligence query service unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[1000] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-500/30 transition-all hover:scale-110 flex items-center gap-2 font-bold text-xs"
        aria-label="Open Bhoomi Assistant"
      >
        <Sparkles className="h-5 w-5" />
        <span className="hidden sm:inline">Ask Bhoomi AI</span>
      </button>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-[1000] w-full max-w-sm sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden text-xs animate-in slide-in-from-bottom">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Bhoomi Assistant AI</h4>
                <p className="text-[10px] text-emerald-400 font-medium">Land Parcel Intelligence & Guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-slate-950/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.disclaimer && (
                    <div className="mt-2 pt-1.5 border-t border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1 font-semibold">
                      <ShieldAlert className="h-3 w-3 shrink-0" />
                      <span>Legal Title Disclaimer Enforced</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 italic text-[11px] p-2">
                <Bot className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                <span>Processing query...</span>
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input
              type="text"
              placeholder="Ask about survey numbers, unit math..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-xl transition-all font-bold"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}

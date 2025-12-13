// src/pages/ChatPage.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  sendChatMessage,
  getHistorySessions,
  getHistorySession,
  createHistorySession,
} from "../api/chat";
import type { ChatMessage, ChatSession } from "../api/chat";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Scale,
  Plus,
  Search,
  MessageSquare,
  Menu,
  ShieldAlert,
  PenTool,
  Languages,
  Tag,
  Mic,
  Send,
  MoreHorizontal,
  BookOpen,
} from "lucide-react";

const ChatPage: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const processedRef = useRef(false); // Fix for strict mode double-firing
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat State
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // History State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const { user } = useAuth();

  const suggestions = [
    {
      icon: <BookOpen className="text-[#125D95]" size={24} />,
      bg: "bg-[#DAECFA]",
      text: "What are my Fundamental Rights if arrested?",
    },
    {
      icon: <ShieldAlert className="text-white" size={24} />,
      bg: "bg-[#379AE6]",
      text: "How do I file an e-FIR for a lost phone?",
      active: true,
    },
    {
      icon: <PenTool className="text-[#125D95]" size={24} />,
      bg: "bg-[#DAECFA]",
      text: "Draft a standard House Rental Agreement format.",
    },
    {
      icon: <Languages className="text-[#125D95]" size={24} />,
      bg: "bg-[#DAECFA]",
      text: "Explain the new Bhartiya Nyaya Sanhita in Hindi.",
    },
    {
      icon: <Tag className="text-[#125D95]" size={24} />,
      bg: "bg-[#DAECFA]",
      text: "Can a shopkeeper charge extra for a carry bag?",
    },
  ];

  // ✅ AUTO MESSAGE FROM HOME PAGE
  useEffect(() => {
    const autoQuery = (location.state as any)?.autoQuery;

    if (autoQuery && !processedRef.current) {
      processedRef.current = true; // Mark as processed immediately
      setQuery(autoQuery);

      // Small timeout to ensure everything is mounted
      setTimeout(() => {
        handleSend(autoQuery);
        // Clear the state so it doesn't fire again on refresh or back button
        navigate(location.pathname, { replace: true, state: {} });
      }, 300);
    }

    // Automatically load sessions
    if (processedRef.current === false) {
      // Only load sessions if we didn't just run an auto-query (or maybe we should always load?)
      // Actually, we should always load sessions.
    }
    loadSessions();
  }, [location.state]); // Add location.state dependency to catch updates properly, but rely on Ref for single execution

  // UseEffect to scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getHistorySessions();
      setSessions(data);
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createHistorySession();
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setQuery("");
      setIsSidebarOpen(false); // Close sidebar on mobile
    } catch (e) {
      console.error("Failed to create new session", e);
    }
  };

  const handleSelectSession = async (sessionId: number) => {
    try {
      setCurrentSessionId(sessionId);
      const details = await getHistorySession(sessionId);

      // Map backend history to frontend messages
      const mappedMessages: ChatMessage[] = details.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      setMessages(mappedMessages);
      setIsSidebarOpen(false); // Close sidebar on mobile
    } catch (e) {
      console.error("Failed to load session", e);
    }
  };

  // ================= SEND HANDLER =================
  const handleSend = async (forcedQuery?: string) => {
    const text = forcedQuery || query.trim();
    if (!text || isSending) return;

    // Optimistic Update
    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuery("");
    setIsSending(true);

    try {
      const res = await sendChatMessage({
        query_text: text,
        language_override: user?.language,
        state_override: user?.state,
        sessionId: currentSessionId || undefined,
      });

      // Handle Session Creation/Update
      if (res.sessionId && !currentSessionId) {
        setCurrentSessionId(res.sessionId);
        loadSessions(); // Reload sidebar to see new title
      } else if (currentSessionId) {
        loadSessions(); // Refresh to bump to top
      }

      const replyText =
        res.answer_primary || res.answer_english || "No answer received.";

      const aiMsg: ChatMessage = {
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errMsg: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, I couldn’t reach the legal assistant right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
  <div className="flex h-full bg-white font-sans text-[#171A1F] overflow-hidden relative">

    {/* Mobile Overlay for Sidebar */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* --- SIDEBAR (unchanged visually) --- */}
    <aside
      className={`
        fixed md:relative z-30
        h-[96%] top-[2%] left-2 md:left-4
        w-[280px] bg-[#DAECFA] rounded-2xl flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"}
      `}
    >
      {/* LEFT: Logo + Brand */}
<div className="p-0 flex items-center relative">
  {/* LOGO */}
  <img
    src="/assets/LP-logo.png"
    alt="LawGuide Logo"
    className="object-contain"
    style={{
      width: "120px",     // 🔹 control logo size
      marginLeft: "75px",// 🔹 overlap transparent padding
      marginTop: "0px", // 🔹 move up/down
    }}
  />
</div>

      <div className="px-4 flex gap-2">
        <button
          onClick={handleNewChat}
          className="flex-1 h-10 bg-[#171A1F] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#262A33] transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm font-medium">New Consultation</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/50 text-[#9095A1] transition-colors">
          <Search size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-6 no-scrollbar">
        <h3 className="text-xs font-medium text-[#171A1F] opacity-60 mb-3 px-2">
          Recent Consultations
        </h3>

        {sessions.length === 0 && (
          <p className="text-gray-500 text-sm px-4 italic">No history yet.</p>
        )}

        <ul className="space-y-1">
          {sessions.map((session) => (
            <li
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors
                ${
                  currentSessionId === session.id
                    ? "bg-[#379AE6]/20 text-[#125D95] font-semibold"
                    : "text-[#565D6D] hover:bg-black/5"
                }
              `}
            >
              <MessageSquare size={18} />
              <span className="truncate">{session.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 mt-auto border-t border-[#171A1F]/10 mx-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#379AE6] overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-bold">{user?.username || "Guest"}</span>
          </div>
          <button className="text-[#9095A1] hover:text-[#171A1F]">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </aside>

    {/* --- MAIN CONTENT --- */}
    <main className="flex-1 flex flex-col h-full relative w-full">

      {/* Mobile header */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white border-b">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
        <span className="font-bold text-lg">LawGuide India</span>
        <div className="w-8" />
      </div>

      {/* MAIN AREA (NO scrolling here) */}
      <div className="flex-1 w-full flex flex-col px-4 md:px-6 py-6 md:py-10 overflow-hidden">

        {/* ========== NO MESSAGES YET (HERO + SUGGESTIONS) ========== */}
        {messages.length === 0 ? (
          <>
            <div className="text-center mb-6 md:mb-8 max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4 text-[#171A1F]">
                Your AI Legal Companion for India
              </h1>
              <p className="text-[#9095A1] text-base md:text-lg italic mt-1 mb-6 md:mb-8">
                Ask questions in English, Hindi, Kannada, Tamil, or any Indian language
              </p>
            </div>

            <div className="w-full max-w-2xl space-y-1 mx-auto">
              {suggestions.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(card.text)}
                  className={`
                    w-full flex items-center p-3 md:p-3.5 rounded-xl border text-left transition-all hover:shadow-md
                    ${
                      (card as any).active
                        ? "border-[#94C9F2] bg-white shadow-[0_0_2px_rgba(23,26,31,0.12)]"
                        : "bg-white border-gray-100 hover:border-blue-200"
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center flex-shrink-0 ${card.bg}`}
                  >
                    {card.icon}
                  </div>
                  <span className="ml-4 text-base md:text-lg text-[#171A1F] flex-1">
                    {card.text}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ========== MESSAGES (only this scrolls) ========== */
          <div className="w-full max-w-3xl flex-1 overflow-y-auto pr-2 space-y-6">

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`w-full flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm md:text-base shadow-sm leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-[#379AE6] text-white rounded-br-none"
                        : "bg-white border border-gray-100 text-[#171A1F] rounded-bl-none shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    }
                  `}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        ul: (props) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: (props) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        li: (props) => <li className="mb-1" {...props} />,
                        strong: (props) => <strong className="font-bold" {...props} />,
                        p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="w-full flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 shadow">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#379AE6] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-[#379AE6] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-[#379AE6] rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="w-full bg-white border-t border-gray-100 pb-6 pt-6 px-4 md:px-0 flex flex-col items-center z-10">
        <div className="w-full max-w-3xl relative shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-xl">
          <textarea
            ref={inputRef as any}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your legal query (e.g., 'Is dowry illegal?')..."
            className="w-full h-[56px] py-4 pl-6 pr-24 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#379AE6] text-lg placeholder:text-gray-400 bg-white resize-none no-scrollbar"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-2 text-[#9095A1] hover:text-[#171A1F] transition-colors rounded-full hover:bg-gray-100">
              <Mic size={20} />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isSending || !query.trim()}
              className={`p-2 transition-colors rounded-full ${
                query.trim() && !isSending
                  ? "bg-[#379AE6] text-white hover:bg-blue-600 shadow-md transform hover:scale-105"
                  : "text-[#9095A1]"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-[#9095A1] text-center px-4 font-medium opacity-70">
          LawGuide AI provides legal information, not professional advice.
        </p>
      </div>
    </main>
  </div>
);
}
export default ChatPage;

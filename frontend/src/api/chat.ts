// frontend/src/api/chat.ts
import api from "./client";
import axios from "axios"; 

// Access API_URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// This type is used in the frontend UI and also can be sent to backend if needed
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Payload shape for backend /ai/chat
export interface ChatRequest {
  query_text: string;
  state_override?: string;
  language_override?: string;
  explanation_mode?: string;
  conversation?: ChatMessage[];
  sessionId?: number; 
}

// What backend sends back (simplified)
export interface ChatResponse {
  sessionId?: number;
  status?: string;
  answer_primary?: string;
  answer_english?: string;
  confidence?: number;
  [key: string]: any;
}

// History Types
export interface ChatSession {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

export interface ChatMessageHistory {
    id: number;
    sessionId: number;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export interface ChatSessionDetail extends ChatSession {
    messages: ChatMessageHistory[];
}

// ================= HISTORY API =================
// Using 'api' client automatically handles the Bearer token!

export const getHistorySessions = async (): Promise<ChatSession[]> => {
    const response = await api.get("/ai/history");
    return response.data;
  };
  
export const getHistorySession = async (id: number): Promise<ChatSessionDetail> => {
    const response = await api.get(`/ai/history/${id}`);
    return response.data;
};
  
export const createHistorySession = async (): Promise<ChatSession> => {
    const response = await api.post("/ai/history", {});
    return response.data;
};

export const deleteHistorySession = async (id: number): Promise<void> => {
    await api.delete(`/ai/history/${id}`);
};

// ================= EXISTING CHAT API =================

// Calls backend /ai/chat (protected by JWT)
export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const res = await api.post("/ai/chat", payload);
  return res.data;
}

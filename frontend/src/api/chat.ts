// frontend/src/api/chat.ts
import api from "./client";

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
}

// What backend sends back (simplified)
export interface ChatResponse {
  status?: string;
  answer_primary?: string;
  answer_english?: string;
  confidence?: number;
  [key: string]: any;
}

// Calls backend /ai/chat (protected by JWT)
export async function sendChatMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const res = await api.post("/ai/chat", payload);
  return res.data;
}

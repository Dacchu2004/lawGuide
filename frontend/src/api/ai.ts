import axios from "axios";

const AI_BASE_URL =
  import.meta.env.VITE_AI_SERVICE_URL || "http://localhost:8001";

/* ---------- SEMANTIC SEARCH ---------- */

export interface AISemanticResult {
  act: string;
  section: string;
  text_primary: string;
  text_english: string;
  jurisdiction: string;
  source_link?: string;
}

export async function getAISemanticResults(payload: {
  query_text: string;
  user_state?: string;
  user_language?: string;
  top_k?: number;
}): Promise<AISemanticResult[]> {
  const res = await axios.post(`${AI_BASE_URL}/search-sections`, payload);
  return res.data.results;
}

/* ---------- SUMMARIZATION ---------- */

export interface AISummaryParams {
  text: string;
  user_state?: string;
  user_language?: string;
}

export async function getAISummary(
  payload: AISummaryParams
): Promise<string> {
  const body = {
    text: payload.text,
    user_language: payload.user_language || "en",
  };

  const res = await axios.post(`${AI_BASE_URL}/summarize-section`, body);
  return res.data.summary as string;
}

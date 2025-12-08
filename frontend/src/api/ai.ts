import axios from "axios";

const AI_BASE_URL = "http://localhost:8001";

export interface AISemanticResult {
  act: string;
  section: string;
  text_primary: string;
  text_english: string;
  jurisdiction: string;
  source_link?: string;
}

export async function getAISummary(payload: {
  query_text: string;
  user_state?: string;
  user_language?: string;
  top_k?: number;
}): Promise<AISemanticResult[]> {
  const res = await axios.post(`${AI_BASE_URL}/search-sections`, payload);
  return res.data.results;
}

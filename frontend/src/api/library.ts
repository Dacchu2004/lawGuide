// frontend/src/api/library.ts
import api from "./client";

export interface LibrarySection {
  id: string;
  act: string;
  section: string;
  text?: string;        // main law text from backend
  description?: string; // optional
  domain?: string;
  year?: string;
  [key: string]: any;
}

export interface LibrarySearchPayload {
  query: string;
  acts?: string[];
  domains?: string[];
  yearMax?: number;
}

// Calls backend /laws/search?query=...
export async function searchLibrary(
  payload: LibrarySearchPayload
): Promise<LibrarySection[]> {
  const params: any = {};
  if (payload.query) params.query = payload.query;

  // Optional: we could send act filter if you want later
  if (payload.acts && payload.acts.length === 1) {
    params.act = payload.acts[0];
  }

  const res = await api.get("/laws/search", { params });
  return res.data.results; // backend: { count, results }
}

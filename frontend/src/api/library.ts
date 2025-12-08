import api from "./client";

export interface LibrarySection {
  id: string;
  act: string;
  section: string;
  text: string;
  jurisdiction?: string;
  state?: string;
  domain?: string;
  sourceLink?: string;
  createdAt?: string;
}

export interface LibrarySearchPayload {
  query: string;
  act?: string;
  section?: string;
  domain?: string;           // ✅ ADD
  jurisdiction?: string;     // ✅ ADD
}

// ✅ Real DB search with ALL dynamic filters
export async function searchLibrary(
  payload: LibrarySearchPayload
): Promise<LibrarySection[]> {
  const params: any = {};

  if (payload.query) params.query = payload.query;
  if (payload.act) params.act = payload.act;
  if (payload.section) params.section = payload.section;
  if (payload.domain) params.domain = payload.domain;               // ✅ FIX
  if (payload.jurisdiction)
    params.jurisdiction = payload.jurisdiction;                     // ✅ FIX

  const res = await api.get("/laws/search", { params });
  return res.data.results;
}

// ✅ Get all Acts
export async function getActs(): Promise<string[]> {
  const res = await api.get("/laws/acts");
  return res.data.acts.map((a: any) => a.act);
}

// ✅ Get single section
export async function getSectionById(id: string): Promise<LibrarySection> {
  const res = await api.get(`/laws/${id}`);
  return res.data;
}

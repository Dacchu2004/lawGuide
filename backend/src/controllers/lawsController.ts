import { Request, Response } from "express";
import prisma from "../config/db";
import axios from "axios";

// ✅ FULL LEGAL SYNONYM MAP
const SYNONYMS: Record<string, string[]> = {
  theft: ["stealing", "robbery", "snatching", "pickpocketing", "burglary"],
  robbery: ["theft", "dacoity", "looting"],
  murder: ["homicide", "killing", "culpable homicide"],
  cheating: ["fraud", "scam", "deception"],

  rent: [
    "tenant",
    "landlord",
    "lease",
    "house rent",
    "eviction",
    "rental dispute",
    "rent agreement",
  ],
  tenant: ["rent", "tenancy", "lessee", "renter", "occupant"],
  landlord: ["tenant", "rent", "house owner", "property owner"],
  eviction: ["remove tenant", "vacate", "forced eviction"],

  household: ["domestic", "family", "matrimonial", "home", "spouse"],
  property: ["house", "land", "flat", "apartment"],
};

// ✅ GENERIC WORDS TO IGNORE
const STOP_WORDS = new Set([
  "problem",
  "issue",
  "law",
  "act",
  "section",
  "case",
  "cases",
  "for",
  "and",
  "the",
  "of",
]);

// ============================================================
// ✅ GET /laws/search  (SMART + DYNAMIC HYBRID SEARCH)
// ============================================================
export const searchLaws = async (req: Request, res: Response) => {
  try {
    const { query, act, section, domain, jurisdiction } = req.query;

    const where: any = {};

    // ✅ DYNAMIC FILTERS
    if (act) {
      where.act = { contains: String(act), mode: "insensitive" };
    }

    if (domain) {
      where.domain = String(domain);
    }

    if (jurisdiction) {
      where.jurisdiction = String(jurisdiction);
    }

    // ✅ ONLY REAL LEGAL SECTIONS
    where.section = { contains: "Section", mode: "insensitive" };

    // ✅ REMOVE JUNK DOCS
    where.NOT = [
      { text: { contains: "FORM" } },
      { text: { contains: "SCHEDULE" } },
      { text: { contains: "WARRANT" } },
      { text: { contains: "NOTICE" } },
      { text: { contains: "BOND" } },
    ];

    // ✅ EXPLICIT ?section=305
    if (section) {
      const sec = String(section).trim();
      const normalized = sec.toLowerCase().startsWith("section")
        ? sec
        : `Section ${sec}`;

      where.section = { contains: normalized, mode: "insensitive" };
    }

    const qRaw = query ? String(query).trim() : "";
    const qLower = qRaw.toLowerCase();

    if (qLower) {
      const tokens = qLower.split(/\s+/).filter(Boolean);
      const extractedNumber = qLower.match(/\d+/)?.[0];

      const orParts: any[] = [];

      // ✅ FULL PHRASE
      orParts.push(
        { text: { contains: qRaw, mode: "insensitive" } },
        { act: { contains: qRaw, mode: "insensitive" } },
        { section: { contains: qRaw, mode: "insensitive" } }
      );

      // ✅ TOKEN + SYNONYM EXPANSION
      for (const token of tokens) {
        if (!token || STOP_WORDS.has(token)) continue;

        orParts.push(
          { text: { contains: token, mode: "insensitive" } },
          { section: { contains: token, mode: "insensitive" } }
        );

        const syns = SYNONYMS[token] || [];
        for (const syn of syns) {
          orParts.push(
            { text: { contains: syn, mode: "insensitive" } },
            { section: { contains: syn, mode: "insensitive" } }
          );
        }
      }

      // ✅ DIRECT SECTION NUMBER MATCH
      if (extractedNumber) {
        orParts.push({
          section: { equals: `Section ${extractedNumber}` },
        });
      }

      where.OR = orParts;
    }

    // ✅ LARGE SQL PULL
    const rawResults = await prisma.legalSection.findMany({
      where,
      take: 200,
      orderBy: { act: "asc" },
    });

    // ================= ✅ RELEVANCE RANKING =================
    const tokens = qLower.split(/\s+/).filter(Boolean);
    const primaryToken = tokens[tokens.length - 1] || "";
    const primarySyns = SYNONYMS[primaryToken] || [];

    function scoreRow(row: any): number {
      const text = (row.text || "").toLowerCase();
      const sec = (row.section || "").toLowerCase();
      const actName = (row.act || "").toLowerCase();

      if (!text || text.length < 40) return -999;

      let score = 0;

      if (primaryToken && sec === `section ${primaryToken}`) score += 120;
      if (qLower && sec.includes(qLower)) score += 60;
      if (qLower && text.startsWith(qLower)) score += 40;
      if (qLower && text.includes(qLower)) score += 30;
      if (qLower && actName.includes(qLower)) score += 20;

      for (const syn of primarySyns) {
        if (sec.includes(syn)) score += 25;
        if (text.includes(syn)) score += 20;
      }

      return score;
    }

    const ranked = rawResults
      .map((row) => ({ row, score: scoreRow(row) }))
      .filter((r) => r.score > -999)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15)
      .map((r) => r.row);

    // ✅ SEMANTIC AI FALLBACK
    if (ranked.length === 0 && qRaw) {
      try {
        const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";

        const semantic = await axios.post(`${aiUrl}/search-sections`, {
          query_text: qRaw,
          top_k: 10,
        });

        res.json({
          count: semantic.data.results.length,
          results: semantic.data.results,
          source: "semantic",
        });
        return;
      } catch (err) {
        console.error("Semantic fallback failed:", err);
      }
    }

    res.json({ count: ranked.length, results: ranked, source: "sql" });
  } catch (error) {
    console.error("searchLaws error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

// ============================================================
// ✅ GET /laws/acts
// ============================================================
export const listActs = async (_req: Request, res: Response) => {
  try {
    const acts = await prisma.legalSection.findMany({
      distinct: ["act"],
      select: { act: true },
      orderBy: { act: "asc" },
    });

    res.json({ acts });
  } catch (error) {
    console.error("listActs error:", error);
    res.status(500).json({ message: "Failed to fetch acts" });
  }
};

// ============================================================
// ✅ GET /laws/act/:actName
// ============================================================
export const getActSections = async (req: Request, res: Response) => {
  try {
    const actName = req.params.actName;

    const sections = await prisma.legalSection.findMany({
      where: { act: actName },
      orderBy: { section: "asc" },
      take: 500,
    });

    res.json({ act: actName, sections });
  } catch (error) {
    console.error("getActSections error:", error);
    res.status(500).json({ message: "Failed to fetch sections for act" });
  }
};

// ============================================================
// ✅ GET /laws/:id
// ============================================================
export const getSectionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const section = await prisma.legalSection.findUnique({
      where: { id },
    });

    if (!section) {
      res.status(404).json({ message: "Section not found" });
      return;
    }

    res.json(section);
  } catch (error) {
    console.error("getSectionById error:", error);
    res.status(500).json({ message: "Failed to fetch section" });
  }
};

// ============================================================
// ✅ GET /laws/semantic-search
// ============================================================
export const semanticSearchLaws = async (req: Request, res: Response) => {
  try {
    const { query, state, language, top_k } = req.query;

    if (!query) {
      res.status(400).json({ message: "query is required" });
      return;
    }

    const payload = {
      query_text: String(query),
      user_state: state ? String(state) : undefined,
      user_language: language ? String(language) : undefined,
      top_k: top_k ? Number(top_k) : 10,
    };

    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
    const response = await axios.post(`${aiUrl}/search-sections`, payload);

    res.json(response.data);
  } catch (error: any) {
    console.error("semanticSearchLaws error:", error?.message || error);
    res.status(500).json({ message: "Semantic search failed" });
  }
};

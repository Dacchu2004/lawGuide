import { Request, Response } from "express";
import prisma from "../config/db";
import axios from "axios";


// GET /laws/search?query=&act=&section=
export const searchLaws = async (req: Request, res: Response) => {
  try {
    const { query, act, section } = req.query;

    const where: any = {};

    if (act) {
      where.act = {
        contains: String(act),
        mode: "insensitive",
      };
    }

    if (section) {
      where.section = {
        contains: String(section),
        mode: "insensitive",
      };
    }

    if (query) {
      where.OR = [
        {
          text: {
            contains: String(query),
            mode: "insensitive",
          },
        },
        {
          act: {
            contains: String(query),
            mode: "insensitive",
          },
        },
        {
          section: {
            contains: String(query),
            mode: "insensitive",
          },
        },
      ];
    }

    const results = await prisma.legalSection.findMany({
      where,
      take: 50,                 // limit to avoid huge payloads
      orderBy: { act: "asc" },
    });

    res.json({ count: results.length, results });
  } catch (error) {
    console.error("searchLaws error:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

// GET /laws/acts
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

// GET /laws/act/:actName
export const getActSections = async (req: Request, res: Response) => {
  try {
    const actName = req.params.actName;

    const sections = await prisma.legalSection.findMany({
      where: {
        act: actName,
      },
      orderBy: {
        section: "asc",          // will be lexicographical, okay for now
      },
      take: 500,
    });

    res.json({ act: actName, sections });
  } catch (error) {
    console.error("getActSections error:", error);
    res.status(500).json({ message: "Failed to fetch sections for act" });
  }
};

// GET /laws/:id
export const getSectionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const section = await prisma.legalSection.findUnique({
      where: { id },
    });

    if (!section) {
        res.status(404).json({ message: "Section not found" });
    }

    res.json(section);
  } catch (error) {
    console.error("getSectionById error:", error);
    res.status(500).json({ message: "Failed to fetch section" });
  }
};

// GET /laws/semantic-search?query=...&state=...&language=...&top_k=...
export const semanticSearchLaws = async (req: Request, res: Response) => {
  try {
    const { query, state, language, top_k } = req.query;

    if (!query) {
      res.status(400).json({ message: "query is required" });
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


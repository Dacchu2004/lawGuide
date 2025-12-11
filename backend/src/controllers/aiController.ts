// src/controllers/aiController.ts
import { Request, Response } from "express";
import prisma from "../config/db";
import axios from "axios";

interface AuthUser {
  id: number;
  state: string;
  language: string;
}

// POST /ai/chat
export const askChatbot = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user as AuthUser | undefined;

    if (!authUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      query_text,
      state_override,
      language_override,
      explanation_mode,
      conversation,
      sessionId, // Optional session ID
    } = req.body;

    if (!query_text || typeof query_text !== "string") {
      return res.status(400).json({ message: "query_text is required" });
    }

    // 1️⃣ Resolve state & language
    const effectiveState = state_override || authUser.state || "India";
    const effectiveLanguage = language_override || authUser.language || "en";

    // 2️⃣ Create a Query row with status "pending"
    const queryRow = await prisma.query.create({
      data: {
        userId: authUser.id,
        queryText: query_text,
        state: effectiveState,
        language: effectiveLanguage,
        status: "pending",
      },
    });

    // 2.5️⃣ Handle Session & Message Saving
    let currentSessionId = sessionId ? Number(sessionId) : null;
    
    // Create new session if none provided
    if (!currentSessionId) {
      const newSession = await prisma.chatSession.create({
        data: {
          userId: authUser.id,
          title: query_text.substring(0, 30) + (query_text.length > 30 ? "..." : ""),
        },
      });
      currentSessionId = newSession.id;
    } else {
      // Check if session has default title "New Consultancy" and update it
      const existingSession = await prisma.chatSession.findUnique({
        where: { id: currentSessionId },
        select: { title: true },
      });

      if (existingSession && existingSession.title === "New Consultancy") {
        await prisma.chatSession.update({
          where: { id: currentSessionId },
          data: {
            title: query_text.substring(0, 30) + (query_text.length > 30 ? "..." : ""),
          },
        });
      }
    }

    // Save User Message
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: "user",
        content: query_text,
      },
    });

    // 3️⃣ Build payload for AI microservice (matches QueryRequest in Python)
    const payload = {
      query_text,
      user_state: effectiveState,
      user_language: effectiveLanguage,
      explanation_mode: explanation_mode || "normal",
      query_id: queryRow.id,
      user_id: authUser.id,
      conversation: Array.isArray(conversation) ? conversation : [],
    };

    const aiBaseUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";

    // 4️⃣ Call AI microservice /answer
    const aiRes = await axios.post(`${aiBaseUrl}/answer`, payload, {
      timeout: 60000,
    });

    const aiData = aiRes.data; // This is QueryResponse from Python

    // 5️⃣ Update Query row with AI status/confidence/response
    // 5️⃣ Update Query row logic handled below

    const aiAnswer = aiData.answer_primary || aiData.answer_english || "I currently have no response.";

    // Save AI Response
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: "assistant", // match schema
        content: aiAnswer,
      },
    });

     // Update request processing status
     await prisma.query.update({
      where: { id: queryRow.id },
      data: {
        status: aiData.status || "answered",
        confidence: typeof aiData.confidence === "number" ? aiData.confidence : null,
        aiResponse: aiAnswer,
      },
    });

    // 6️⃣ Return combined data to frontend
    return res.json({
      queryId: queryRow.id,
      userState: effectiveState,
      userLanguage: effectiveLanguage,

        sessionId: currentSessionId, // Return session ID
      ...aiData, // includes status, answer_primary, answer_english, confidence, retrieved_sections, etc.
    });
  } catch (error: any) {
    console.error("askChatbot error:", error?.message || error);

    // Try to update Query row to 'error' if it exists
    const queryId = (req as any).queryRowId as number | undefined;
    if (queryId) {
      await prisma.query.update({
        where: { id: queryId },
        data: { status: "error" },
      });
    }

    return res.status(500).json({ message: "Chatbot failed. Please try again later." });
  }
};

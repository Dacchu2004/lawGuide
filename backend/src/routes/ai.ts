// src/routes/ai.ts
import { Router } from "express";
import { askChatbot } from "../controllers/aiController";
import { createSession, getSessions, getSession, deleteSession } from "../controllers/historyController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Protected route - requires logged-in user
// Chatbot
router.post("/chat", authenticate, askChatbot);

// History
router.post("/history", authenticate, createSession);
router.get("/history", authenticate, getSessions);
router.get("/history/:id", authenticate, getSession);
router.delete("/history/:id", authenticate, deleteSession);

export default router;

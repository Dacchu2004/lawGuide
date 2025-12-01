// src/routes/ai.ts
import { Router } from "express";
import { askChatbot } from "../controllers/aiController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Protected route - requires logged-in user
router.post("/chat", authenticate, askChatbot);

export default router;

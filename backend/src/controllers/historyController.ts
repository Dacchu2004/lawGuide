import { Request, Response } from "express";
import prisma from "../config/db";

interface AuthUser {
  id: number;
}

// POST /ai/history
export const createSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const session = await prisma.chatSession.create({
      data: {
        userId: user.id,
        title: "New Consultancy",
      },
    });

    return res.json(session);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create session" });
  }
};

// GET /ai/history
export const getSessions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return res.json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// GET /ai/history/:id
export const getSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    const { id } = req.params;
    
    // Ensure session belongs to user
    const session = await prisma.chatSession.findUnique({
      where: { id: Number(id) },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session || session.userId !== user.id) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.json(session);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch session" });
  }
};

// DELETE /ai/history/:id
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as AuthUser;
    const { id } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { id: Number(id) },
    });

    if (!session || session.userId !== user.id) {
        return res.status(404).json({ message: "Session not found" });
    }

    await prisma.chatSession.delete({
      where: { id: Number(id) },
    });

    return res.json({ message: "Session deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete session" });
  }
};

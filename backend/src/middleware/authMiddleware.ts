import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

// 👇 Extend the interface properly (keep it)
export interface AuthRequest extends Request {
  user?: {
    id: number;
    state?: string;
    language?: string;
    [key: string]: any;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Authorization token required" });
    return;
  }

  try {
    // 👇 Decode JWT properly
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      state?: string;
      language?: string;
    };

    // ✅ CHECK IF USER EXISTS IN DB
    // This prevents "Foreign Key Violation" if the user was deleted but token is valid
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, state: true, language: true, username: true },
    });

    if (!user) {
       res.status(401).json({ message: "User no longer exists. Please login again." });
       return;
    }

    req.user = {
      ...decoded, // keep other claims if any
      id: user.id,
      state: user.state,
      language: user.language,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

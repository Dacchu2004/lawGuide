import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 👇 Extend the interface properly (keep it)
export interface AuthRequest extends Request {
  user?: {
    id: number;
    state?: string;
    language?: string;
    [key: string]: any;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
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

    req.user = decoded; // 👈 Only decoded user info
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

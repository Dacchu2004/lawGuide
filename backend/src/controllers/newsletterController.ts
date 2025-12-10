
import { Request, Response } from 'express';
import prisma from '../config/db';

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
       res.status(200).json({ message: "Already subscribed!" });
       return;
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, state, language, username } = req.body;

    // required fields
    if (!email || !password || !state || !language) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // existing user check
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        state,
        language,
        username, // ✅ optional
      },
    });

    // hide password
    const { password: _, ...userData } = user;

    return res
      .status(201)
      .json({ message: "Signup successful", user: userData });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Signup failed", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // JWT payload: we can also include username if you want
    const token = jwt.sign(
      {
        id: user.id,
        state: user.state,
        language: user.language,
        username: user.username ?? undefined,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        state: user.state,
        language: user.language,
        username: user.username ?? null, // ✅ send to frontend
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Login failed", error });
  }
};

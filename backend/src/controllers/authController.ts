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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user; // from auth middleware
    const { state, language, username } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(state && { state }),
        ...(language && { language }),
        ...(username && { username }),
      },
    });

    const { password: _, ...userData } = updatedUser;

    res.json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

// --- Password Reset Flow ---

import nodemailer from 'nodemailer';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 1. Check user (Always return success to prevent enumeration)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Fake success
      return res.json({ message: "If the email is registered, an OTP has been sent." });
    }

    // 2. Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // 3. Clear old OTPs
    await prisma.passwordResetOTP.deleteMany({ where: { userId: user.id } });

    // 4. Store new OTP (Expires in 3 mins = 180s)
    await prisma.passwordResetOTP.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt: new Date(Date.now() + 180 * 1000), 
      },
    });

    // 5. Send Email (or Log in Dev)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or use env config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'LawGuide India - Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It expires in 3 minutes.`,
      });
    } else {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    }

    return res.json({ message: "If the email is registered, an OTP has been sent." });


  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid Request" });

    const record = await prisma.passwordResetOTP.findFirst({
      where: { userId: user.id },
    });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });

    // 2. Check Expiry
    if (new Date() > record.expiresAt) {
        return res.status(400).json({ message: "OTP expired. Please resend." });
    }

    // 3. Check Attempts limit (Before verifying)
    if (record.attempts >= record.maxAttempts) {
        await prisma.passwordResetOTP.delete({ where: { id: record.id } });
        return res.status(400).json({ message: "Too many attempts. Please resend OTP." });
    }

    // 4. Verify Hash
    const isMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isMatch) {
      // Increment attempts
      const updatedRecord = await prisma.passwordResetOTP.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });

      // Check if limit hit AFTER increment
      if (updatedRecord.attempts >= updatedRecord.maxAttempts) {
        await prisma.passwordResetOTP.delete({ where: { id: record.id } });
        return res.status(400).json({ message: "Too many attempts. Please resend OTP." });
      }

      return res.status(400).json({ message: `Invalid OTP. Attempts remaining: ${updatedRecord.maxAttempts - updatedRecord.attempts}` });
    }

    // 5. Success
    await prisma.passwordResetOTP.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Missing fields" });

    // Validate Password Strength (Basic)
    if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid Request" });

    const record = await prisma.passwordResetOTP.findFirst({
      where: { userId: user.id },
    });

    // CRITICAL: Ensure Verified
    if (!record || !record.verified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    // Check expiry for safety
    if (new Date() > record.expiresAt) {
        return res.status(400).json({ message: "OTP expired. Please start over." });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update User
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete OTP
    await prisma.passwordResetOTP.delete({
      where: { id: record.id },
    });

    return res.json({ message: "Password reset successful. Please log in." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Reset failed" });
  }
};

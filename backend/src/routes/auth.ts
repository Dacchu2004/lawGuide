import {Router} from "express";
import { signup,login, updateProfile, forgotPassword, verifyOtp, resetPassword } from "../controllers/authController";

import { authenticate } from "../middleware/authMiddleware";

const router=Router();

router.post("/signup",signup);
router.post("/login",login);
router.put("/update", authenticate, updateProfile as any);

// Password Reset Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
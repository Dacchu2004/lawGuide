import {Router} from "express";
import { signup,login, updateProfile } from "../controllers/authController";

import { authenticate } from "../middleware/authMiddleware";

const router=Router();

router.post("/signup",signup);
router.post("/login",login);
router.put("/update", authenticate, updateProfile as any);

export default router;
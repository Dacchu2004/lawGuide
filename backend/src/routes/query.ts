import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { handleQuery} from "../controllers/queryController";

const router = Router();

router.post("/ask",authenticate,handleQuery);

export default router;

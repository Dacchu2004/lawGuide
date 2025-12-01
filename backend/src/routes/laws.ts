import { Router } from "express";
import {
  searchLaws,
  listActs,
  getActSections,
  getSectionById,
  semanticSearchLaws,   // add this
} from "../controllers/lawsController";

const router = Router();

router.get("/search", searchLaws);
router.get("/semantic-search", semanticSearchLaws);  // 🆕
router.get("/acts", listActs);
router.get("/act/:actName", getActSections);
router.get("/:id", getSectionById);

export default router;


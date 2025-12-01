import { Router } from "express";
import {
  searchLaws,
  listActs,
  getActSections,
  getSectionById,
} from "../controllers/lawsController";

const router = Router();

router.get("/search", searchLaws);
router.get("/acts", listActs);
router.get("/act/:actName", getActSections);
router.get("/:id", getSectionById);

export default router;

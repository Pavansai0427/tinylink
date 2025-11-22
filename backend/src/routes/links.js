import express from "express";
import {
  getAllLinks,
  getOneLink,
  createLink,
  deleteLink,
  redirectCode,
  healthCheck,
} from "../controllers/linksController.js";

const router = express.Router();


router.get("/api/links", getAllLinks);
router.get("/api/links/:code", getOneLink);
router.post("/api/links", createLink);
router.delete("/api/links/:code", deleteLink);


router.get("/healthz", healthCheck);


router.get("/:code", redirectCode);

export default router;

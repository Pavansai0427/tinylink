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

// API
router.get("/api/links", getAllLinks);
router.get("/api/links/:code", getOneLink);
router.post("/api/links", createLink);
router.delete("/api/links/:code", deleteLink);

// healthz
router.get("/healthz", healthCheck);

// redirect
router.get("/:code", redirectCode);

export default router;

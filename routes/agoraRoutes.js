import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateAgoraToken } from "../controllers/agoraController.js";

const router = express.Router();

// Generate Agora Token
router.get("/token", protect, generateAgoraToken);

export default router;

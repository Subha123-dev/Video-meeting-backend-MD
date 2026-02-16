import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Get Profile (Protected)
router.get("/profile", protect, getUserProfile);

export default router;

import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../schemas/authSchemas.js";
import { createAdmin } from "../controllers/adminController.js";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

// Protected route – only accessible to existing admins
router.post("/admin/create", verifyToken, requireAdmin, createAdmin);

export default router;

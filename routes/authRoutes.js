import express from "express";
import { signup, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../schemas/authSchemas.js";
import { createAdmin } from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.post("/admin/create", verifyToken, verifyAdmin, createAdmin);

export default router;

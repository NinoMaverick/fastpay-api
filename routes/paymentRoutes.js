import express from "express";
import { createPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payments — idempotent payment creation
router.post("/payments", createPayment);

export default router;

import express from "express";
import { createPayment } from "../controllers/paymentController.js";

/**
 * @swagger
 * tags:
 *   name: createPayment
 *   description: make a new payment
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment (idempotent)
 *     tags: [Payments]
 *     description: |
 *       Processes a new payment request in an idempotent way.
 *       If the same `Idempotency-Key` header is sent twice, FastPay will return the same result instead of charging twice.
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the request to ensure idempotency.
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 amount:
 *                   type: number
 *                   example: 1000
 *                 currency:
 *                   type: string
 *                   example: NGN
 *                 reference:
 *                   type: string
 *                   example: TXN-1698356123456
 *                 message:
 *                   type: string
 *                   example: Payment processed successfully ✅
 *       400:
 *         description: Missing Idempotency-Key header
 *       500:
 *         description: Internal server error
 */

const router = express.Router();

// POST /api/payments — idempotent payment creation
router.post("/payments", createPayment);

export default router;

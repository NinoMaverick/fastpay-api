import express from "express";
import { healthCheck, deepHealthCheck } from "../controllers/healthController.js";

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoints for FastPay API
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     description: Returns the status and uptime of the FastPay API.
 *     responses:
 *       200:
 *         description: API is running normally
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 1234.56
 *                 message:
 *                   type: string
 *                   example: FastPay API is running smoothly 🚀
 */

/**
 * @swagger
 * /health/deep:
 *   get:
 *     summary: Deep system health check
 *     tags: [Health]
 *     description: Checks health of the database, Redis, and other dependencies.
 *     responses:
 *       200:
 *         description: All systems are healthy
 *       500:
 *         description: One or more systems are unhealthy
 */

const router = express.Router();


router.get("/", healthCheck);
router.get("/deep", deepHealthCheck);

export default router;

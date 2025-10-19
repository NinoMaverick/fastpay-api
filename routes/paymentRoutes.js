import express from "express";
import redisClient from "../redis.js";

const router = express.Router();

/**
 * POST /api/payments
 * Demonstrates an idempotent endpoint using Redis
 * Request Header: Idempotency-Key: <unique_id>
 */
router.post("/payments", async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Missing Idempotency-Key header",
    });
  }

  try {
    // Step 1: Check if this key already exists in Redis
    const cached = await redisClient.get(idempotencyKey);

    if (cached) {
      console.log("♻️ Returning cached result for:", idempotencyKey);
      return res.json(JSON.parse(cached)); // return stored response
    }

    // Step 2: Simulate payment or other processing
    console.log("💸 Processing new payment...");

    // simulate delay (like a real payment process)
    await new Promise((resolve) => setTimeout(resolve, 1000)); 

    const result = {
      status: "success",
      amount: 1000,
      currency: "NGN",
      reference: `TXN-${Date.now()}`,
      message: "Payment processed successfully ✅",
    };

    // Step 3: Store response in Redis for 10 minutes
    await redisClient.setEx(idempotencyKey, 600, JSON.stringify(result));

    console.log("✅ Stored new result under key:", idempotencyKey);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Payment error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import redisClient from "../redis.js";

/**
 * Handle idempotent payment creation
 */
const createPayment = async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];

  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Missing Idempotency-Key header",
    });
  }

  try {
    // Step 1: Check Redis for cached response
    const cached = await redisClient.get(idempotencyKey);
    if (cached) {
      console.log("♻️ Returning cached result for:", idempotencyKey);
      return res.json(JSON.parse(cached));
    }

    // Step 2: Simulate payment processing
    console.log("💸 Processing new payment...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = {
      status: "success",
      amount: 1000,
      currency: "NGN",
      reference: `TXN-${Date.now()}`,
      message: "Payment processed successfully ✅",
    };

    // Step 3: Cache result in Redis for 10 minutes
    await redisClient.setEx(idempotencyKey, 600, JSON.stringify(result));

    console.log("✅ Stored new result under key:", idempotencyKey);
    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Payment error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createPayment };
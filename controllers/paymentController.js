import redisClient from "../redis.js";
import db from "../db.js";


export const createPayment = async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];
  const userId = req.user?.id;

  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Missing Idempotency-Key header",
    });
  }
  if (!userId) {
    return res.status(403).json({
      error: "Unauthorized. Token missing or invalid"
    });
  }

  try {
    const cached = await redisClient.get(idempotencyKey);
    if (cached) {
      console.log("Returning cached result for:", idempotencyKey);
      return res.json(JSON.parse(cached));
    }

    console.log("Processing new payment...", userId);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const paymentData = {
      user_id: userId,
      amount: req.body.amount || 1000,
      currency: req.body.currency || "NGN",
      status: "SUCCESS",
      reference: `TXN-${Date.now()}`,
    };

    const [payment] = await db("payments")
      .insert(paymentData)
      .returning(["id", "reference", "amount", "currency", "status", "created_at"]);

    const result = {
      message: "Payment processed successfully ",
      payment,
    };

    await redisClient.setEx(idempotencyKey, 600, JSON.stringify(result));

    console.log(" Stored new result under key:", idempotencyKey);
    res.status(201).json(result);
  } catch (err) {
    console.error(" Payment error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await db("payments")
      .select("id", "user_id", "amount", "currency", "status", "reference", "created_at")
      .orderBy("created_at", "desc");

    res.json({ total: payments.length, payments });
  } catch (err) {
    console.error(" Fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id;

    const payments = await db("payments")
      .where({ user_id: userId })
      .select("id", "amount", "currency", "status", "reference", "created_at")
      .orderBy("created_at", "desc");

    res.json({ total: payments.length, payments });
  } catch (err) {
    console.error(" Fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
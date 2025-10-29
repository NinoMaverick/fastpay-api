import pool from "../db.js";
import client from "../redis.js";

/**
 * Ping endpoint - Redis latency & caching test
 */

const ping = async (req, res) => {
try {
  const cached = await client.get("ping-response");
  if (cached) {
    console.log("⚡ Serving from Redis cache");
    return res.json(JSON.parse(cached));
  }
  await new Promise((resolve) => setTimeout(resolve, 500)); 
  const response = { message: "pongggg 🧠" };
  
  await client.setEx("ping-response", 10, JSON.stringify(response));
  res.json(response);
} catch (error) {
   console.error("Redis error:", error);
   res.status(500).json({ error: "Redis connection failed ❌" })   
    }};

   // 🧩 PostgreSQL status check route (Day 3)
const dbStatus = async (req, res) => {
try {
  const result = await pool.query("SELECT NOW()");
  res.json({
      status: "Connected ✅",
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    console.error("❌ Database error:", err.message);
    res.status(500).json({ status: "Error", message: err.message });
  }
};

export { ping, dbStatus };
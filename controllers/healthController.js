import pool from "../db.js";
import redisClient from "../redis.js";

// Basic Health Check
const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    message: "FastPay API is running smoothly 🚀",
  });
};

// Deep Health Check
const deepHealthCheck = async (req, res) => {
  try {
    const dbStatus = await pool.query("SELECT NOW()");
    const redisStatus = await redisClient.ping();

    res.json({
      status: "ok",
      db: dbStatus ? "connected ✅" : "disconnected ❌",
      redis: redisStatus === "PONG" ? "connected ✅" : "disconnected ❌",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};


export { healthCheck, deepHealthCheck };

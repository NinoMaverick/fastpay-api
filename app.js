import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import pool from "./db.js";
import client from "./redis.js";
import testRoutes from "./routes/dbTest.js";
import RedisStore from "rate-limit-redis";

dotenv.config(); // load .env variables

const app = express();

// Apply rate limiting to prevent abuse

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    status: 429,
    error: "Too many requests. Please try again after a minute."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);


// Attach Redis client globally
app.locals.redis = client;

// Logging + request timer
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`Incoming request: ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request ${req.method} ${req.url} completed in ${duration}ms`);
  });

  next(); 
});

app.use("/", testRoutes);


// Ping route with lazy caching
app.get("/ping", async (req, res) => {
  const cached = await client.get("ping-response");

  if (cached) {
    console.log("⚡ Serving from Redis cache");
    return res.json(JSON.parse(cached));
  }

  console.log("🧠 Cache miss, simulating delay...");
  console.time("ping");
  
  await new Promise((resolve) => setTimeout(resolve, 500)); 

  const response = { message: "pongggg 🧠" };
  console.timeEnd("ping");

  await client.setEx("ping-response", 10, JSON.stringify(response));
  console.log("🧠 Saved new response to Redis cache");
  res.json(response);
})

// 🧩 PostgreSQL status check route (Day 3)
app.get("/db-status", async (req, res) => {
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
});

// General server status route 
app.get("/status", (req, res) => {
    const uptime = process.uptime(); 
    const timestamp = new Date().toISOString(); 

    res.json({
        uptime: `${uptime.toFixed(2)} seconds`,
        timestamp
    });
});

export default app;

import express from "express";
import dotenv from "dotenv";
import pool from "./db.js";
import { createClient } from 'redis';
import testRoutes from "./routes/dbTest.js";

dotenv.config(); // load .env variables

const app = express();

app.use((req, res, next) => {
  console.log("⚡ Incoming URL:", req.url);
  next();
});

app.use("/", testRoutes);

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on("error", (err) => console.log("❌ Redis Client Error:", err));

(async () => {
  await client.connect();
  console.log("✅ Connected to Redis Cloud");
 
  // Attach Redis to app (so routes can use it)
  app.locals.redis = client;
})();

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`Incoming request: ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request ${req.method} ${req.url} completed in ${duration}ms`);
  });

  next(); 
});

// DAY ONE - Latency test after spinning up simple Express API
// app.get("/ping", async (req, res) => {
//     console.time("ping");

//     // simulate async delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     // measure before sending response
//     console.timeEnd("ping");

//      res.json({ message: "pongggg 🧠" });
// });


// DAY TWO - Redis Caching

// Ping route with lazy caching
app.get("/ping", async (req, res) => {
  const cached = await client.get("ping-response");

  if (cached) {
    console.log("⚡ Serving from Redis cache");
    return res.json(JSON.parse(cached));
  }

  console.log("🧠 Cache miss, simulating delay...");
  console.time("ping");
  
  // simulate async delay (e.g. a DB/API call)
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

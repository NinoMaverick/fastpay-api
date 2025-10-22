import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import pool from "./db.js";
import client from "./redis.js";
import testRoutes from "./routes/dbTest.js";
import RedisStore from "rate-limit-redis";
import paymentRoutes from "./routes/paymentRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";
import systemRoutes from "./routes/systemRoutes.js";

dotenv.config(); // load .env variables

const app = express();

// Apply rate limiting to prevent abuse (Day 5)
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

// General server status route 
app.get("/status", (req, res) => {
    const uptime = process.uptime(); 
    const timestamp = new Date().toISOString(); 

    res.json({
        uptime: `${uptime.toFixed(2)} seconds`,
        timestamp
    });
});

app.use("/", testRoutes);
app.use("/api", paymentRoutes);
app.use("/health", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/system", systemRoutes);

export default app;

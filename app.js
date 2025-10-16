import express from "express";
import { createClient } from 'redis';
const app = express();

const client = createClient({
    username: 'default',
    password: 'LAVKv3hcU0LuhJ5SBVrQkqCeA3Rzfy9F',
    socket: {
        host: 'redis-19660.c240.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 19660
    }
});

client.on('error', err => console.log('Redis Client Error', err));

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

// DAY ONE - Latency test
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

  // cache the response for 10 seconds
  await client.setEx("ping-response", 10, JSON.stringify(response));

  console.log("🧠 Saved new response to Redis cache");
  res.json(response);
})

app.get("/status", (req, res) => {
    const uptime = process.uptime(); //seconds the server has been running
    const timestamp = new Date().toISOString(); // current server time

    res.json({
        uptime: `${uptime.toFixed(2)} seconds`,
        timestamp
    });
});

export default app;

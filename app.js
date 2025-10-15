const express = require("express");
const app = express();

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`Incoming request: ${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request ${req.method} ${req.url} completed in ${duration}ms`);
  });

  next(); // pass control to the next middleware/route
});

app.get("/ping", async (req, res) => {
    console.time("ping");

    // simulate async delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // measure before sending response
    console.timeEnd("ping");

     res.json({ message: "pongggg 🧠" });
});

app.get("/status", (req, res) => {
    const uptime = process.uptime(); //seconds the server has been running
    const timestamp = new Date().toISOString(); // current server time

    res.json({
        uptime: `${uptime.toFixed(2)} seconds`,
        timestamp
    });
});

module.exports = app;
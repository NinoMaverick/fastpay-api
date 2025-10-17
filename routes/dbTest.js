import express from "express";
import pool from "../db.js"; 

const router = express.Router();

console.log("Pool settings:", pool.options);

router.get("/test-load", async (req, res) => {
  console.time("parallel-queries");

  const queries = Array.from({ length: 10 }).map(() =>
    pool.query("SELECT pg_sleep(0.5);")
  );

  await Promise.all(queries);

  console.timeEnd("parallel-queries");

  res.json({ message: "10 parallel queries completed ✅" });
});

export default router; 

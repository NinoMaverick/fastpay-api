import express from "express";
import { ping, dbStatus } from "../controllers/systemController.js";

const router = express.Router();

router.get("/ping", ping);
router.get("/db-status", dbStatus);

export default router;

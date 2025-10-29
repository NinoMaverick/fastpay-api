import jwt from "jsonwebtoken";
import db from "../db.js";


export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

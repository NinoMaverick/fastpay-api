import bcrypt from "bcrypt";
import db from "../db.js";

export const createAdmin = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const adminRole = await db("roles").where({ name: "admin" }).first();

    const [newAdmin] = await db("users")
      .insert({
        email,
        password_hash,
        full_name,
        role_id: adminRole.id,
      })
      .returning(["id", "email", "full_name"]);

    res.status(201).json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    console.error("Admin creation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

export const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).
      json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existing = await db("users").where({ email }).first();
    if (existing) {
      return res.status(409).
      json({ message: "Email already in use" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Fetch the regular "User" role ID
    const userRole = await db("roles").where({ name: "user" }).first();
    if (!userRole) {
      return res.status(500).json({ message: "User role not found in system" });
    }

    // Insert user with User role by default
    const [newUser] = await db("users")
      .insert({
        email,
        password_hash,
        full_name,
        role_id: userRole.id,
      })
      .returning(["id", "email", "full_name"]);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, role: "User" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Signup successful",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const role = await db("roles").where({ id: user.role_id }).first();

    const token = jwt.sign(
      { id: user.id, role: role.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: role.name,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
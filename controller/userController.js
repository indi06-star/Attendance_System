import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/config.js";
import { config } from "dotenv";
config();
export const signUpUser = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;
    if (!email.endsWith("@lifechoices.co.za")) {
      return res.status(403).json({ message: "Only LifeChoices admin emails can sign up." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      username,
      hashedPassword,
      email,
      phone_number,
    ]);
    res.status(201).json({
      message: "Admin signed up successfully",
      admin: {
        admin_id: result.insertId,
        username,
        email,
        phone_number,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error signing up admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/config.js";
import { config } from "dotenv";
import { getAdminByEmail } from "../model/userModel.js";
config();

export const signUpAdmin = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;
    // Only allow emails ending with @lifechoices.co.za
    if (!email.endsWith("@lifechoices.co.za")) {
      return res.status(403).json({ message: "Only LifeChoices admin emails can sign up." });
    }
    // Check password strength
    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    if (!isStrongPassword) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include a capital letter, small letter, number, and special symbol."
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the new admin into the database
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [username, hashedPassword, email, phone_number]);
    // Respond with the new admin's info
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
// Admin Login
const loginAdmin = async (req, res) => {
    try{
        const {email, password} = req.body;
         // Check if the admin account exists
        const admin = await getAdminByEmail(email);
        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '100d' });
        res.json({
            message: "Login successful",
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                phone_number: admin.phone_number
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error", error });
    }
    }
// Exporting the functions
export {loginAdmin}

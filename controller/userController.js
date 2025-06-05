import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/config.js";
import { config } from "dotenv";
import { getAdminByEmail } from "../model/userModel.js";
config();

export const signUpAdmin = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;

    // Step 1: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 2: Insert the admin into the database
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [username, hashedPassword, email, phone_number]);
    // Step 3: Send response
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


    export const logoutAdmin = (req, res) => {
  console.log("Logout endpoint hit. Client should now discard their token.");
    res.status(200).json({ message: "Logout successful. Please discard your token on the client-side." });
};
// Exporting the functions
export {loginAdmin}

import { pool } from "../config/config.js";
import bcrypt from "bcrypt";
//signup admin
export const signUpUser = async (username, email, phone_number, password) => {
  try {
    // Allow only admin emails to sign up
    if (!email.endsWith("@lifechoices.co.za")) {
      throw new Error("Only admin emails from @lifechoices.co.za are allowed.");
    }
    // Check if the password is strong
    // Must have: 8 characters, uppercase, lowercase, number, and special character
    const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    if (!isStrong) {
      throw new Error("Password must be at least 8 characters long and include a capital letter, small letter, number, and special symbol.");
    }
    // Hash the password to keep it secure
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the new admin to the database
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [username, hashedPassword, email, phone_number]);
    // Return the new admin's info
    return {
      admin_id: result.insertId,
      username,
      email,
      phone_number,
      user_role: "admin"
    };
  } catch (error) {
    // Show any errors that happen during signup
    throw error;
  }
};

// login admin 
export const getAdminByEmail = async (email) => {
    console.log("Checking for admin with email:", email);
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    return rows[0];  // Return first admin if exists
};

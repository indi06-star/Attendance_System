import { pool } from "../config/config.js";
import bcrypt from "bcrypt";

//signup admin
export const signUpUser = async (username, email, phone_number, password) => {
  try {
    if (!email.endsWith("@lifechoices.co.za")) {
      throw new Error("Unauthorized: Only admin emails are allowed to sign up.");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [username, hashedPassword, email, phone_number]);
    return {
      admin_id: result.insertId,
      username,
      email,
      phone_number,
      user_role: "admin"
    };
  } catch (error) {
    throw error;
  }
};

// login admin 


export const getAdminByEmail = async (email) => {
    console.log("Checking for admin with email:", email);
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    return rows[0];  // Return first admin if exists
};

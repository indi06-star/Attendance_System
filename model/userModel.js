import { pool } from "../config/config.js"; // Get database connection info
import bcrypt from "bcrypt"; // Library to make passwords safe (hashing)

// Sign up a new admin user
export const signUpUser = async (username, email, phone_number, password) => {
  try {
    // Make the password safe so no one can read it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ask the database to add this new admin
    const query = `
      INSERT INTO admin (username, password_hash, email, phone_number)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [username, hashedPassword, email, phone_number]);

    // Give back the new admin info
    return {
      admin_id: result.insertId, // The ID the database gave this admin
      username,
      email,
      phone_number,
      user_role: "admin" // This user is an admin
    };
  } catch (error) {
    // If something goes wrong, throw the error
    throw error;
  }
};

// Login: find admin by email
export const getAdminByEmail = async (email) => {
  console.log("Checking for admin with email:", email); // Just printing the email to see in logs

  // Look for admin in the database using the email
  const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);

  return rows[0]; // If found, give back the first admin found
};

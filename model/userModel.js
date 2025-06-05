import { pool } from "../config/config.js";
import bcrypt from "bcrypt";

// Register a new admin
export const signUpUser = async (username, email, phone_number, password) => {
  try {
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

// Get admin by email (for login)
export const getAdminByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM admin WHERE email = ?", [email]);
  return rows[0];
};

// Get all admins
export const getAllAdmins = async () => {
  const [rows] = await pool.query("SELECT id, username, email, phone_number FROM admin");
  return rows;
};

// Get single admin by username
export const getAdminByUsername = async (username) => {
  const [rows] = await pool.query("SELECT id, username, email, phone_number FROM admin WHERE username = ?", [username]);
  return rows[0];
};

// Update an admin by username
export const updateAdminByUsername = async (username, updates) => {
  const { email, phone_number, password } = updates;
  let query = "UPDATE admin SET ";
  const params = [];

  if (email) {
    query += "email = ?, ";
    params.push(email);
  }

  if (phone_number) {
    query += "phone_number = ?, ";
    params.push(phone_number);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    query += "password_hash = ?, ";
    params.push(hashedPassword);
  }

  if (params.length === 0) {
    throw new Error("No fields provided for update.");
  }

  // Remove last comma and space
  query = query.slice(0, -2);

  query += " WHERE username = ?";
  params.push(username);

  const [result] = await pool.query(query, params);
  return result;
};

// Delete an admin by username
export const deleteAdminByUsername = async (username) => {
  const [result] = await pool.query("DELETE FROM admin WHERE username = ?", [username]);
  return result;
};

// Get the database connection from config file
import { pool } from "../config/config.js"; 

// Get all users from "users_cred" table
// Ask the database for all users
// Give back the users
export const getusers_db = async () => {
  const [users] = await pool.query("SELECT * FROM users_cred"); 
  return users; 
};

// Find one admin by their email
// Look for admin with the same email
// If we find one, give them back. If not, give back null
export const findUserByEmail = async (email) => {
  const [user] = await pool.query("SELECT * FROM admin WHERE email = ?", [email]); 
  return user.length ? user[0] : null; 
};

// Save the reset token and when it will stop working
// Put the token and expiry time for that email
export const storeResetToken = async (email, token, expiresAt) => {
  const [result] = await pool.query(
    "UPDATE admin SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiresAt, email] 
  );
  if (result.affectedRows === 0) {
    // If no admin was updated, show an error
    throw new Error("Failed to store reset token. Email may not exist.");
  }
};

// Find user by their reset token if it's still not expired
export const findUserByToken = async (token) => {
  const [user] = await pool.query(
    "SELECT * FROM admin WHERE reset_token = ? AND reset_token_expiry > NOW()", // Check token and if it's still good
    [token]
  );
  return user.length ? user[0] : null; // If found, return the user. If not, return null
};

// Change the password for the user and remove the reset token
export const updatePassword = async (email, hashedPassword) => {
  await pool.query(
    "UPDATE admin SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
    [hashedPassword, email] // Save new password and delete token + expiry time
  );
};

import { pool } from "../config/config.js";

export const getusers_db = async () => {
  const [users] = await pool.query("SELECT * FROM users_cred");
  return users;
};

export const findUserByEmail = async (email) => {
  const [user] = await pool.query("SELECT * FROM admin WHERE email = ?", [email]);
  return user.length ? user[0] : null;
};

export const storeResetToken = async (email, token, expiresAt) => {
  const [result] = await pool.query(
    "UPDATE admin SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
    [token, expiresAt, email]
  );
  if (result.affectedRows === 0) {
    throw new Error("Failed to store reset token. Email may not exist.");
  }
};

export const findUserByToken = async (token) => {
  const [user] = await pool.query(
    "SELECT * FROM admin WHERE reset_token = ? AND reset_token_expiry > NOW()",
    [token]
  );
  return user.length ? user[0] : null;
};

export const updatePassword = async (email, hashedPassword) => {
  await pool.query(
    "UPDATE admin SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?",
    [hashedPassword, email]
  );
};

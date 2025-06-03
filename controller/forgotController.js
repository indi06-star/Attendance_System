import crypto from "crypto";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { transporter } from "../config/emailTransporter.js";
import {
  findUserByEmail,
  storeResetToken,
  findUserByToken,
  updatePassword,
  getusers_db
} from "../model/forgotModel.js";
import { API_URL } from "../config/config.js";

dotenv.config();

export const getusers = async (req, res) => {
  try {
    const users = await getusers_db();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    await storeResetToken(email, token, expiresAt);

    const resetURL = `${API_URL}/Html/reset-password.html?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await findUserByToken(token);
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await updatePassword(user.email, hashedPassword);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Server error" });
  }
};

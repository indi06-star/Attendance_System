import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRouter from './routes/userRouter.js';
import { transporter } from './config/emailTransporter.js';
import forgotRouter from './routes/forgotRouter.js'

config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[HIDDEN]" : "NOT FOUND");

const app =express()

// Middleware to parse JSON
app.use(cors({
  origin: "http://localhost:8080", // your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test email route
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "indiphilemcengwa.29@gmail.com",
      subject: "Test Email from Node.js",
      text: "This is a test email using Nodemailer.",
    });
    res.send("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).send("Email failed to send.");
  }
});
// Routes
app.use('/', userRouter);
app.use('/', forgotRouter);
app.use('/api/users', userRouter);
app.use('/',forgotRouter)
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});



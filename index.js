import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import userRouter from './routes/userRouter.js';

config();
const app = express();

app.use(cors());
app.use(express.json());

// test forgot password
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "indiphilemcengwa.29@gmail.com",
      subject: "Testing Email",
      text: "This is a test email from Node.js using Nodemailer.",
    });
    res.send("✅ Email sent successfully!");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).send("Email failed to send.");
  }
});

// Define routes
app.use('/', userRouter);
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
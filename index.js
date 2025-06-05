 //Bring in Express to build the server
import express from 'express';
//CORS lets frontend talk to backend
import cors from 'cors'; 
//Helps us use secret stuff from .env file
import { config } from 'dotenv'; 
//Routes for admin sign up/login
import userRouter from './routes/userRouter.js'; 
//Tool to send emails
import { transporter } from './config/emailTransporter.js';
//Routes for forgot/reset password 
import forgotRouter from './routes/forgotRouter.js'; 
//Load .env values (like email and passwords)
config(); 

console.log("EMAIL_USER:", process.env.EMAIL_USER); //Show email user in console
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "[HIDDEN]" : "NOT FOUND"); //Don’t show real password

const app = express(); //Start the Express app

//Allow frontend to talk to backend
app.use(cors({
  origin: "http://localhost:8080", //This is where the frontend lives
  credentials: true, //Allow sending cookies or headers
}));

//Middleware to understand JSON and form data
app.use(express.json()); // Read JSON from requests
app.use(express.urlencoded({ extended: true })); // Read form data too

//Test route to send a test email
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Who is sending the email
      to: "indiphilemcengwa.29@gmail.com", // Who will get the email
      subject: "Test Email from Node.js", // Email subject
      text: "This is a test email using Nodemailer.", // Email body
    });
    res.send("✅ Email sent successfully!"); // Successfull email sent notification!
  } catch (err) {
    console.error("❌ Email sending failed:", err); // Something went wrong
    res.status(500).send("Email failed to send."); // Tell the user it failed
  }
});

//Routes to handle admin and password stuff
app.use('/', userRouter); //Admin login/signup
app.use('/', forgotRouter); //Forgot/reset password
app.use('/api/users', userRouter); //Another way to access user routes
app.use('/', forgotRouter); // (repeated but okay for now)

//Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000'); //Show it's working
});

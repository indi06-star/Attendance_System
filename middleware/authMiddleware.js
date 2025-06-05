import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

// Load the secret info from the .env file
dotenv.config();

// This checks things when admin tries to sign up
export const adminSignUpAuth = (req, res, next) => {
  const { mainAdminPassword, email, password } = req.body;

  // Check if main admin password is correct
  if (mainAdminPassword !== process.env.MAIN_ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized: Invalid main admin password." });
  }

  // Check if email ends with @lifechoices.co.za
  if (!email.endsWith("@lifechoices.co.za")) {
    return res.status(403).json({ message: "Only admin emails from @lifechoices.co.za are allowed." });
  }

  // Check if password is strong (has big letter, small letter, number, and symbol)
  const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  if (!isStrong) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include a capital letter, small letter, number, and special symbol."
    });
  }

  // Everything is okay, go to the next step
  next();
};

// This checks if the user is logged in (token is valid)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  // Get token from the header (after "Bearer ")
  const token = authHeader && authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  // If there is no token, user is not allowed
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  // If the secret key is missing, something is wrong on the server
  if (!JWT_SECRET) {
    console.error("JWT Secret is missing in .env file!");
    return res.status(500).json({ message: 'Server error: Secret key not configured' });
  }

  // Check if token is real and not broken
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log("Decoded Token:", decoded);

    // Save the user's info from the token (like id and email)
    req.user = decoded;

    // Everything is okay, go to the next step
    next();
  });
};

// Let other files use this function
export { authenticateToken };

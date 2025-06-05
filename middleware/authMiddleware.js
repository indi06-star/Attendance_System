import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';


dotenv.config();
//signup
export const adminSignUpAuth = (req, res, next) => {
  const { mainAdminPassword, email, password } = req.body;

  // Main admin password check
  if (mainAdminPassword !== process.env.MAIN_ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized: Invalid main admin password." });
  }
  
  // LifeChoices domain check
  if (!email.endsWith("@lifechoices.co.za")) {
    return res.status(403).json({ message: "Only admin emails from @lifechoices.co.za are allowed." });
  }

  // Password strength check
  const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  if (!isStrong) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include a capital letter, small letter, number, and special symbol."
    });
  }

  next();
};
////Login authentication

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Auth Header:", authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error("JWT Secret is missing in .env file!");
        return res.status(500).json({ message: 'Server error: Secret key not configured' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        console.log("Decoded Token:", decoded);
        req.user = decoded; // Ensure this includes { admin_id, email }
        next();
    });
};


export { authenticateToken};
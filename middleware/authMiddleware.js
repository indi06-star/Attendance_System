import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';

dotenv.config();

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
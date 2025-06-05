 // Bring in Express to make a web server
import express from 'express';
// Get the functions to sign up, log in, and log out admins
import { signUpAdmin, loginAdmin, logoutAdmin } from '../controller/userController.js'; 
// Get the checks (middleware) to protect routes
import { authenticateToken, adminSignUpAuth } from '../middleware/authMiddleware.js'; 
// Make a router to handle admin routes
const router = express.Router(); 

//When an admin wants to add a new admin
//First, we check the main admin password and email (adminSignUpAuth)
//Then we call the function to sign up the new admin
router.post('/', adminSignUpAuth, signUpAdmin);

//When an admin wants to log in
router.post('/login', loginAdmin);

//When an admin wants to log out
router.post('/logout', logoutAdmin);

//Just a test route (or protected route) to check if token is valid
//Only works if the token is correct (authenticateToken)
router.get('/', authenticateToken);

export default router; // Let other files use this router

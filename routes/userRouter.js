 // Bring in Express to make a web server
import express from 'express';
// Get the functions to sign up, log in, and log out admins
import { signUpAdmin, loginAdmin, logoutAdmin ,getAllAdmins,  getAdminByUsername,updateAdminByUsername,deleteAdminByUsername} from '../controller/userController.js'; 
// Get the checks (middleware) to protect routes
import { authenticateToken, adminSignUpAuth } from '../middleware/authMiddleware.js'; 
// Make a router to handle admin routes
const router = express.Router(); 

// admin should be able to signup another admin//
router.post('/', adminSignUpAuth,signUpAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/username/:username', getAdminByUsername);
// Update admin by username
router.patch('/admins/username/:username', updateAdminByUsername);
// Delete admin by username
router.delete('/admins/username/:username', deleteAdminByUsername);


//When an admin wants to log in
router.post('/login', loginAdmin);

//When an admin wants to log out
router.post('/logout', logoutAdmin);

//Just a test route (or protected route) to check if token is valid
//Only works if the token is correct (authenticateToken)
router.get('/', authenticateToken);

export default router; // Let other files use this router

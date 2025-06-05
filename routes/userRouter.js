import express from 'express';
import { signUpAdmin, loginAdmin, logoutAdmin,getAllAdmins,  getAdminByUsername,updateAdminByUsername,deleteAdminByUsername} from '../controller/userController.js';
import {authenticateToken,adminSignUpAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// admin should be able to signup another admin//
router.post('/', adminSignUpAuth,signUpAdmin);
router.get('/admins', getAllAdmins);
router.get('/admins/username/:username', getAdminByUsername);
// Update admin by username
router.patch('/admins/username/:username', updateAdminByUsername);
// Delete admin by username
router.delete('/admins/username/:username', deleteAdminByUsername);


// login routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/',authenticateToken)
export default router;

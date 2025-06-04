import express from 'express';
import { signUpAdmin, loginAdmin, logoutAdmin} from '../controller/userController.js';
import {authenticateToken,adminSignUpAuth } from '../middleware/authMiddleware.js';
const router = express.Router();

// admin should be able to signup another admin//
router.post('/', adminSignUpAuth,signUpAdmin);

// login routes
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/',authenticateToken)
export default router;

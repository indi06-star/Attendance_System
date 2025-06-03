import express from 'express';
import { signUpAdmin, loginAdmin} from '../controller/userController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// delete code after signing up admin//
router.post('/user', signUpAdmin);

// login routes
router.post('/login', loginAdmin);
router.get('/',authenticateToken)
export default router;

import express from 'express';
import { signUpAdmin, loginAdmin} from '../controller/userController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// admin should be able to signup another admin//
router.post('/', signUpAdmin);
// login routes
router.post('/login', loginAdmin);
router.get('/',authenticateToken)
export default router;

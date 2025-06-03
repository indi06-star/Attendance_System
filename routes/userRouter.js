import express from 'express';
import { signUpUser, loginAdmin} from '../controller/userController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// delete code after signing up admin//
router.post('/user', signUpUser);

// login routes

router.post('/login', loginAdmin);

router.get('/',authenticateToken)

export default router;

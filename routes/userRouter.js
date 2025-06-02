import express from 'express';
import { signUpUser, loginUserCon, loginAdminCon } from '../controller/userController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// delete code after signing up admin//
router.post('/user', signUpUser);

// login routes

router.post('/login/user', loginUserCon);
router.post('/login/admin', loginAdminCon);

router.get('/',authenticateToken)

export default router;

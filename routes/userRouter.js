import express from 'express';
import { signUpUser,  } from '../controller/userController.js';

const router = express.Router();

// delete code after signing up admin//
router.post('/user', signUpUser);

export default router;

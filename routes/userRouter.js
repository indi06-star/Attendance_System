import express from 'express';
import { signUpUser,  } from '../controller/userController.js';

const router = express.Router();
// delete code after signing up admin//
router.post('/user', signUpUser);///admin should be able to signup a new admin

export default router;

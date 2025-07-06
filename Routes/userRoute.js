import { registerUser, loginUser, googleLogin, renewToken } from '../Controllers/userController.js';
import express from 'express';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/renew-token', renewToken);

export default router;
import { getAllResumes } from '../Controllers/ResumeDataController.js';
import { registerUser, loginUser, googleLogin, renewToken } from '../Controllers/userController.js';
import express from 'express';
import authMiddleware from '../middleware/AuthenticationMIddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/renew-token', renewToken);
router.get('/getResumeList',authMiddleware, getAllResumes);

export default router;
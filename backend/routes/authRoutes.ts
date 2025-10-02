import express from 'express';
import { handleCallback, handleLogin } from '../controllers/authController';

const router = express.Router();

router.get('/login', handleLogin);

router.get('/callback', handleCallback);

export default router;

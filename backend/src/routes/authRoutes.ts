import express from 'express';
import { register, login, getProfile } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);

export default router;

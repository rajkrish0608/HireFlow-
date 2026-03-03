import { Router } from 'express';
import { register, login } from './auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new HR or Interviewer account
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and receive JWT token
 * @access  Public
 */
router.post('/login', login);

export default router;

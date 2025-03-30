import express from 'express';
import { register } from '../controllers/userController.js';

const router = express.Router();

// Route for User Registration
router.post('/register', register);

export default router;

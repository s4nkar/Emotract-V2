import express from 'express';
import { register, searchContact } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';

const router = express.Router();

// Route for User Registration
router.post('/register', register);
router.post('/login', login);
router.get('/search-contact', searchContact);

export default router;

import { Router } from 'express';

import { loginUser } from '../controllers/auth.js';

const router = Router();

//login route
router.post('/login', loginUser);

// signup route
router.post('/signup')

export default router;
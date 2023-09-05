import { Router } from 'express';
const router = Router();
import { register, login, logout } from '../controller/authController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';

router.post('/register', validateRegisterInput, register);
router.route('/login').post(validateLoginInput, login);
router.get('/logout', logout);

export default router;

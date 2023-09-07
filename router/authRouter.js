import { Router } from 'express';
const router = Router();
import { register, login, logout } from '../controller/authController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';
import rateLimiter from 'express-rate-limit';

const apiLimiter = rateLimiter({
  windows: 15 * 60 * 1000,
  max: 15,
  message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' }
});
router.post('/register', validateRegisterInput, register);
router.route('/login').post(validateLoginInput, login);
router.get('/logout', logout);

export default router;

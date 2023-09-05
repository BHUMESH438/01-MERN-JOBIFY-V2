import { Router } from 'express';
const router = Router();
import { getCurrentUser, getApplicationStatus, updateUser } from '../controller/userController.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';
import { authorizePermissions, checkForTestUser } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddleware.js';
//we can upload single file/ multiple file
router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [authorizePermissions('admin'), getApplicationStatus]);
router.patch('/update-user', checkForTestUser, upload.single('avatar'), validateUpdateUserInput, updateUser);
export default router;

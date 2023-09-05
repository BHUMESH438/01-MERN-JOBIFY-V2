import { Router } from 'express';
import { getAllJob, getSingleJob, deleteJob, updateJob, createJob, showStats } from '../controller/jobController.js';
import { validateJobInput, validateParams } from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';
const router = Router();

router.route('/').get(getAllJob).post(checkForTestUser, validateJobInput, createJob);

router.route('/stats').get(showStats);
router.route('/:id').get(validateParams, getSingleJob).delete(checkForTestUser, validateParams, deleteJob).patch(checkForTestUser, validateJobInput, updateJob);

export default router;

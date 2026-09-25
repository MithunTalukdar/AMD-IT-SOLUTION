import { Router } from 'express';
import { getAMCPlans, getAMCById, getAMCBySlug, createAMC, updateAMC, deleteAMC } from '../controllers/amc.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { amcCreateSchema, amcUpdateSchema } from '../validators/index.js';

const router = Router();

router.get('/', getAMCPlans);
router.get('/slug/:slug', getAMCBySlug);
router.get('/:id', getAMCById);

router.post('/', protect, authorize('admin'), validate(amcCreateSchema), createAMC);
router.put('/:id', protect, authorize('admin'), validate(amcUpdateSchema), updateAMC);
router.delete('/:id', protect, authorize('admin'), deleteAMC);

export default router;

import { Router } from 'express';
import { getServices, getServiceById, createService, updateService, deleteService, getCategories } from '../controllers/service.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { serviceCreateSchema, serviceUpdateSchema } from '../validators/index.js';

const router = Router();

// Public — required by test-health.mjs
router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only
router.post('/', protect, authorize('admin'), validate(serviceCreateSchema), createService);
router.put('/:id', protect, authorize('admin'), validate(serviceUpdateSchema), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;

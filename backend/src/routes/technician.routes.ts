import { Router } from 'express';
import { getTechnicians, getTechnicianById, createTechnician, updateTechnician, deleteTechnician, getMyTechnicianProfile } from '../controllers/technician.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { technicianCreateSchema, technicianUpdateSchema } from '../validators/index.js';

const router = Router();

router.get('/', getTechnicians);
router.get('/me/profile', protect, authorize('technician', 'admin'), getMyTechnicianProfile);
router.get('/:id', getTechnicianById);

router.post('/', protect, authorize('admin'), validate(technicianCreateSchema), createTechnician);
router.put('/:id', protect, authorize('admin', 'technician'), validate(technicianUpdateSchema), updateTechnician);
router.delete('/:id', protect, authorize('admin'), deleteTechnician);

export default router;

import { Router } from 'express';
import { register, login, me, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { registerSchema, loginSchema } from '../validators/index.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);

// Admin-only customer/user management
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Alias for customers (same as users with role=customer)
router.get('/customers', protect, authorize('admin'), getAllUsers);

// Also support legacy /api/v1 style for compatibility
router.post('/registration', validate(registerSchema), register);

export default router;

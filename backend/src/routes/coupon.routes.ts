import { Router } from 'express';
import { getCoupons, getCouponById, validateCoupon, createCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { couponCreateSchema } from '../validators/index.js';

const router = Router();

router.post('/validate', validateCoupon);

// Admin-only list and CRUD
router.get('/', protect, authorize('admin'), getCoupons);
router.get('/:id', protect, authorize('admin'), getCouponById);
router.post('/', protect, authorize('admin'), validate(couponCreateSchema), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;

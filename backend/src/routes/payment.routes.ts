import { Router } from 'express';
import {
  createPayment,
  createOrder,
  verifyPayment,
  markFailed,
  webhook,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  paymentCreateSchema,
  paymentCreateOrderSchema,
  paymentVerifySchema,
  paymentFailedSchema,
  paymentStatusSchema,
} from '../validators/index.js';

const router = Router();

// Webhook must be public (Razorpay calls it) — no protect, verify via HMAC
// Must use rawBody, so mount before protect
router.post('/webhook', webhook);

// All other routes require auth
router.use(protect);

// Production flow
router.post('/create-order', validate(paymentCreateOrderSchema), createOrder);
router.post('/verify', validate(paymentVerifySchema), verifyPayment);
router.post('/mark-failed', validate(paymentFailedSchema), markFailed);

// Legacy (deprecated) — kept to avoid break but returns 410
router.post('/', validate(paymentCreateSchema), createPayment);

router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.patch('/:id/status', authorize('admin'), validate(paymentStatusSchema), updatePaymentStatus);

export default router;

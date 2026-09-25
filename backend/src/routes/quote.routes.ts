import { Router } from 'express';
import { createQuote, getQuotes, getQuoteById, updateQuoteStatus, deleteQuote } from '../controllers/quote.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { quoteCreateSchema, quoteStatusSchema } from '../validators/index.js';

const router = Router();

router.post('/', validate(quoteCreateSchema), createQuote);

// Protected for admin/technician
router.get('/', protect, authorize('admin', 'technician'), getQuotes);
router.get('/:id', protect, authorize('admin', 'technician'), getQuoteById);
router.patch('/:id/status', protect, authorize('admin'), validate(quoteStatusSchema), updateQuoteStatus);
router.delete('/:id', protect, authorize('admin'), deleteQuote);

export default router;

import { Router } from 'express';
import { getReviews, getReviewById, createReview, updateReview, deleteReview } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reviewCreateSchema } from '../validators/index.js';

const router = Router();

router.get('/', getReviews);
router.get('/:id', getReviewById);

router.post('/', protect, validate(reviewCreateSchema), createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

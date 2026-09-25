import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { productCreateSchema, productUpdateSchema } from '../validators/index.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), validate(productCreateSchema), createProduct);
router.put('/:id', protect, authorize('admin'), validate(productUpdateSchema), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;

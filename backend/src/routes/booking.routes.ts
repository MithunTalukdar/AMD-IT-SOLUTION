import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  assignTechnician,
  cancelBooking,
  getAvailableSlots,
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { bookingCreateSchema, bookingStatusSchema, assignTechnicianSchema } from '../validators/index.js';

const router = Router();

// Public: available slots (no auth) — used in booking wizard step 3
router.get('/slots', getAvailableSlots);

// All other booking routes require auth
router.use(protect);

router.post('/', authorize('customer', 'admin'), validate(bookingCreateSchema), createBooking);
router.get('/', getBookings); // filtered by role inside controller
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', authorize('admin', 'technician'), validate(bookingStatusSchema), updateBookingStatus);
router.post('/:id/assign', authorize('admin'), validate(assignTechnicianSchema), assignTechnician);
router.patch('/:id/cancel', cancelBooking);

export default router;

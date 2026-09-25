import Joi from 'joi';

// Auth
export const registerSchema = Joi.object({
  fullname: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('customer', 'technician', 'admin').optional(),
  phone: Joi.string().optional().allow('', null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Service
export const serviceCreateSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  slug: Joi.string().min(2).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().valid('cctv', 'computer', 'networking', 'amc', 'biometric', 'other').required(),
  price: Joi.number().min(0).required(),
  oldPrice: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional().allow('', null),
  features: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
});

export const serviceUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(200).optional(),
  slug: Joi.string().min(2).max(200).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  category: Joi.string().valid('cctv', 'computer', 'networking', 'amc', 'biometric', 'other').optional(),
  price: Joi.number().min(0).optional(),
  oldPrice: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional().allow('', null),
  features: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
});

// Booking — customer flow: service → date → timeSlot → details → address → summary
export const bookingCreateSchema = Joi.object({
  service: Joi.string().hex().length(24).required(),
  serviceType: Joi.string().valid('cctv', 'computer', 'networking', 'amc', 'biometric', 'other').optional(),
  date: Joi.date().iso().required(),
  timeSlot: Joi.string().required(), // must be from available slots
  customerName: Joi.string().min(2).max(100).required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().pattern(/^[0-9+\-\s]{7,15}$/).required(),
  address: Joi.string().min(5).max(300).required(),
  city: Joi.string().min(2).max(100).required(),
  pincode: Joi.string().pattern(/^[0-9]{4,10}$/).optional().allow('', null),
  // legacy phone kept for backward compat
  phone: Joi.string().optional(),
  notes: Joi.string().optional().allow('', null),
  totalAmount: Joi.number().min(0).optional(),
  coupon: Joi.string().hex().length(24).optional().allow(null, ''),
});

export const bookingStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'technician_assigned', 'assigned', 'on_the_way', 'in_progress', 'completed', 'cancelled').required(),
  technician: Joi.string().hex().length(24).optional().allow(null, ''),
  note: Joi.string().optional().allow('', null),
});

export const assignTechnicianSchema = Joi.object({
  technician: Joi.string().hex().length(24).required(),
});

// Technician
export const technicianCreateSchema = Joi.object({
  user: Joi.string().hex().length(24).required(),
  specialization: Joi.array().items(Joi.string()).optional(),
  experienceYears: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  isVerified: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
});

export const technicianUpdateSchema = Joi.object({
  specialization: Joi.array().items(Joi.string()).optional(),
  experienceYears: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  isVerified: Joi.boolean().optional(),
  isAvailable: Joi.boolean().optional(),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
});

// Product
export const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional().allow('', null),
  description: Joi.string().optional().allow('', null),
  isActive: Joi.boolean().optional(),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  sku: Joi.string().optional(),
  category: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional().allow('', null),
  description: Joi.string().optional().allow('', null),
  isActive: Joi.boolean().optional(),
});

// Quote
export const quoteCreateSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  serviceType: Joi.string().required(),
  message: Joi.string().min(5).required(),
  location: Joi.string().optional().allow('', null),
});

export const quoteStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'contacted', 'quoted', 'closed').required(),
});

// Review
export const reviewCreateSchema = Joi.object({
  service: Joi.string().hex().length(24).optional().allow(null, ''),
  technician: Joi.string().hex().length(24).optional().allow(null, ''),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(5).max(1000).required(),
});

// AMC
export const amcCreateSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  price: Joi.number().min(0).required(),
  period: Joi.string().valid('yearly', 'monthly').optional(),
  forType: Joi.string().required(),
  features: Joi.array().items(Joi.string()).optional(),
  isPopular: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

export const amcUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  period: Joi.string().valid('yearly', 'monthly').optional(),
  forType: Joi.string().optional(),
  features: Joi.array().items(Joi.string()).optional(),
  isPopular: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

// Coupon
export const couponCreateSchema = Joi.object({
  code: Joi.string().min(3).max(20).required(),
  discountType: Joi.string().valid('percent', 'flat').required(),
  discountValue: Joi.number().min(0).required(),
  minAmount: Joi.number().min(0).optional(),
  maxDiscount: Joi.number().min(0).optional().allow(null),
  expiry: Joi.date().iso().required(),
  isActive: Joi.boolean().optional(),
  usageLimit: Joi.number().min(1).optional(),
});

// Payment — production Razorpay flow
export const paymentCreateSchema = Joi.object({
  booking: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(0).required(),
  method: Joi.string().valid('cod', 'online', 'upi', 'card').optional(),
  transactionId: Joi.string().optional().allow('', null),
});

export const paymentCreateOrderSchema = Joi.object({
  bookingId: Joi.string().optional(),
  booking: Joi.string().optional(),
}).or('bookingId', 'booking');

export const paymentVerifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  bookingId: Joi.string().optional(),
});

export const paymentFailedSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  reason: Joi.string().valid('failed', 'cancelled').optional(),
});

export const paymentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'failed', 'refunded', 'cancelled').required(),
  // paid is forbidden via generic update — must use /verify
});

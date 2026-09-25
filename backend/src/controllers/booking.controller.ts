import { Request, Response } from 'express';
import Booking, { STATUS_TRANSITIONS, BookingStatus } from '../models/Booking.js';
import Service from '../models/Service.js';
import Coupon from '../models/Coupon.js';
import Technician from '../models/Technician.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

// Standard slots
export const ALL_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
];

export const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
  const { date, service } = req.query as any;
  if (!date) return res.status(400).json({ success: false, message: 'date query required (YYYY-MM-DD)' });
  if (!isDBConnected()) {
    return res.json({ success: true, data: ALL_SLOTS.map(s => ({ slot: s, available: true, booked: 0 })) });
  }
  const dayStart = new Date(date);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Count bookings per slot for that day (optionally per service)
  const match: any = { date: { $gte: dayStart, $lte: dayEnd }, status: { $ne: 'cancelled' } };
  if (service) match.service = service;

  const agg = await Booking.aggregate([
    { $match: match },
    { $group: { _id: '$timeSlot', count: { $sum: 1 } } },
  ]);
  const bookedMap = new Map(agg.map(a => [a._id, a.count]));
  // Simple capacity: max 3 bookings per slot per day
  const capacity = 3;
  const data = ALL_SLOTS.map(slot => {
    const booked = bookedMap.get(slot) || 0;
    return { slot, booked, capacity, available: booked < capacity };
  });
  return res.json({ success: true, data, date });
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const {
    service,
    serviceType,
    date,
    timeSlot,
    customerName,
    customerEmail,
    customerPhone,
    phone, // fallback
    address,
    city,
    pincode,
    notes,
    coupon,
  } = req.body;

  // Validate slot
  if (!ALL_SLOTS.includes(timeSlot)) {
    return res.status(400).json({ success: false, message: 'Invalid timeSlot. Choose from available slots.' });
  }

  const svc = await Service.findById(service);
  if (!svc) return res.status(404).json({ success: false, message: 'Service not found' });

  // Check slot availability (max 3)
  const day = new Date(date);
  const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day); dayEnd.setHours(23, 59, 59, 999);
  const existing = await Booking.countDocuments({
    date: { $gte: dayStart, $lte: dayEnd },
    timeSlot,
    status: { $ne: 'cancelled' },
  });
  if (existing >= 3) {
    return res.status(409).json({ success: false, message: 'Selected time slot is fully booked. Please choose another.' });
  }

  let totalAmount = svc.price;
  let couponRef = undefined;
  if (coupon) {
    const cp = await Coupon.findById(coupon);
    if (cp && cp.isActive && cp.expiry > new Date() && cp.usedCount < cp.usageLimit) {
      if (totalAmount >= cp.minAmount) {
        const discount = cp.discountType === 'percent' ? (totalAmount * cp.discountValue) / 100 : cp.discountValue;
        const capped = cp.maxDiscount ? Math.min(discount, cp.maxDiscount) : discount;
        totalAmount = Math.max(0, totalAmount - capped);
        couponRef = cp._id;
      }
    }
  }

  const booking = await Booking.create({
    user: userId,
    service,
    serviceType: serviceType || svc.category,
    date: day,
    timeSlot,
    customerName,
    customerEmail: customerEmail.toLowerCase(),
    customerPhone: customerPhone || phone,
    address,
    city,
    pincode,
    notes,
    totalAmount,
    coupon: couponRef,
    status: 'pending',
  });

  const populated = await booking.populate('service', 'title price category image');
  return res.status(201).json({ success: true, message: 'Booking created', data: populated });
});

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const user = (req as any).user;
  const filter: any = {};
  // Strict RBAC: customers see only own; technicians see assigned; admin sees all
  if (user.role === 'customer') filter.user = user.id;
  else if (user.role === 'technician') {
    // technicians see only bookings where technician equals their profile
    // Find technician doc for this user
    const tech = await Technician.findOne({ user: user.id });
    if (tech) filter.technician = tech._id;
    else return res.json({ success: true, data: [] });
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.bookingId) filter.bookingId = req.query.bookingId;
  if (req.query.search) filter.bookingId = { $regex: req.query.search, $options: 'i' };
  const items = await Booking.find(filter)
    .populate('service', 'title price category image')
    .populate('user', 'fullname email phone')
    .populate({ path: 'technician', populate: { path: 'user', select: 'fullname email phone' } })
    .sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [] });
  const userId = (req as any).user.id;
  const items = await Booking.find({ user: userId })
    .populate('service', 'title price image category')
    .populate({ path: 'technician', populate: { path: 'user', select: 'fullname phone' } })
    .sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = (req as any).user;
  const id = req.params.id as string;
  // allow lookup by _id or bookingId
  const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { bookingId: id };
  const booking = await Booking.findOne(query as any)
    .populate('service')
    .populate('user', 'fullname email phone')
    .populate({ path: 'technician', populate: { path: 'user', select: 'fullname email phone' } });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (user.role === 'customer' && booking.user.toString() !== user.id && (booking as any).user._id?.toString() !== user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  if (user.role === 'technician') {
    const tech = await Technician.findOne({ user: user.id });
    if (!tech || booking.technician?.toString() !== tech._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: not your assignment' });
    }
  }
  return res.json({ success: true, data: booking });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = (req as any).user;
  let { status, note } = req.body;
  if (status === 'assigned') status = 'technician_assigned';
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  // RBAC: who can trigger which transition?
  // pending->confirmed: admin only
  // confirmed->technician_assigned: admin only (requires technician)
  // technician_assigned->on_the_way, on_the_way->in_progress, in_progress->completed: technician (assigned) or admin
  // cancelled: customer (own pending/confirmed) or admin/technician (any before completed)
  const current = booking.status as BookingStatus;
  const next = status as BookingStatus;

  if (!STATUS_TRANSITIONS[current]?.includes(next)) {
    return res.status(400).json({ success: false, message: `Invalid transition from ${current} to ${next}. Allowed: ${STATUS_TRANSITIONS[current].join(', ') || 'none'}` });
  }

  // Role checks per transition
  if (next === 'confirmed' && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admin can confirm bookings' });
  }
  if (next === 'technician_assigned' && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admin can assign technician' });
  }
  if (['on_the_way', 'in_progress', 'completed'].includes(next) && !['technician', 'admin'].includes(user.role)) {
    return res.status(403).json({ success: false, message: 'Only technician or admin can update this status' });
  }
  if (next === 'cancelled') {
    // customer can cancel only own pending/confirmed/technician_assigned before on_the_way
    if (user.role === 'customer') {
      if (booking.user.toString() !== user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
      if (!['pending', 'confirmed', 'technician_assigned'].includes(current)) {
        return res.status(400).json({ success: false, message: `Cannot cancel from status ${current}` });
      }
    }
  }

  // Technician ownership check for technician transitions
  if (['on_the_way', 'in_progress', 'completed'].includes(next) && user.role === 'technician') {
    const tech = await Technician.findOne({ user: user.id });
    if (!tech || booking.technician?.toString() !== tech._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this booking' });
    }
  }

  booking.status = next;
  booking.statusHistory.push({ status: next, changedAt: new Date(), changedBy: user.id, note } as any);
  await booking.save();
  await booking.populate('service', 'title price');
  await booking.populate({ path: 'technician', populate: { path: 'user', select: 'fullname' } } as any);
  return res.json({ success: true, message: `Booking status updated to ${next}`, data: booking });
});

export const assignTechnician = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const { technician } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (!['confirmed', 'pending'].includes(booking.status)) {
    return res.status(400).json({ success: false, message: `Cannot assign technician when status is ${booking.status}. Confirm first.` });
  }
  const tech = await Technician.findById(technician).populate('user', 'fullname');
  if (!tech) return res.status(404).json({ success: false, message: 'Technician not found' });
  if (!tech.isAvailable) return res.status(400).json({ success: false, message: 'Technician not available' });

  booking.technician = tech._id as any;
  booking.status = 'technician_assigned';
  booking.statusHistory.push({ status: 'technician_assigned', changedAt: new Date(), changedBy: (req as any).user.id } as any);
  await booking.save();
  await booking.populate('service', 'title');
  await booking.populate({ path: 'technician', populate: { path: 'user', select: 'fullname phone' } } as any);
  return res.json({ success: true, message: 'Technician assigned', data: booking });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (role === 'customer' && booking.user.toString() !== userId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return res.status(400).json({ success: false, message: `Cannot cancel booking with status ${booking.status}` });
  }
  // customers cannot cancel after on_the_way
  if (role === 'customer' && ['on_the_way', 'in_progress', 'completed'].includes(booking.status)) {
    return res.status(400).json({ success: false, message: `Cannot cancel after ${booking.status}` });
  }
  booking.status = 'cancelled';
  booking.statusHistory.push({ status: 'cancelled', changedAt: new Date(), changedBy: userId } as any);
  await booking.save();
  return res.json({ success: true, message: 'Booking cancelled', data: booking });
});

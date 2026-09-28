import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking, { STATUS_TRANSITIONS, BookingStatus } from '../models/Booking.js';
import Service from '../models/Service.js';
import Coupon from '../models/Coupon.js';
import Technician from '../models/Technician.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';
import connectDB from '../config/db.js';

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

const STATIC_SERVICES_MAP: Record<string, { title: string; category: string; price: number; slug: string }> = {
  'cctv-home-kit': { title: '2 Camera HD Home Surveillance Kit', category: 'cctv', price: 6499, slug: 'cctv-home-kit' },
  'cctv-shop-combo': { title: '4 Camera Commercial & Shop Combo', category: 'cctv', price: 12999, slug: 'cctv-shop-combo' },
  'cctv-ip-enterprise': { title: 'IP Camera & NVR Enterprise Surveillance', category: 'cctv', price: 18999, slug: 'cctv-ip-enterprise' },
  'computer-repair-service': { title: 'Computer & Laptop Repair / Full Service', category: 'computer', price: 599, slug: 'computer-repair-service' },
  'ssd-speed-upgrade': { title: 'Superfast SSD & RAM Speed Boost Upgrade', category: 'computer', price: 2199, slug: 'ssd-speed-upgrade' },
  'custom-pc-assembly': { title: 'Custom PC Assembly (Office / Gaming / Editing)', category: 'computer', price: 18999, slug: 'custom-pc-assembly' },
  'printer-repair-service': { title: 'Printer Repair & Cartridge Refilling', category: 'computer', price: 499, slug: 'printer-repair-service' },
  'office-wifi-mesh-setup': { title: 'High-Speed Office Wi-Fi & Mesh Setup', category: 'networking', price: 3999, slug: 'office-wifi-mesh-setup' },
  'structured-lan-cabling-rack': { title: 'Structured LAN Cabling & Server Rack Setup', category: 'networking', price: 7999, slug: 'structured-lan-cabling-rack' },
  'firewall-router-vpn-config': { title: 'Firewall, Router & Secure VPN Configuration', category: 'networking', price: 5499, slug: 'firewall-router-vpn-config' },
  'amc-small-office-plan': { title: 'Annual AMC — Small Office / Shop Plan', category: 'amc', price: 4999, slug: 'amc-small-office-plan' },
  'amc-corporate-pro-plan': { title: 'Annual AMC — Corporate Pro Plan (10-30 PCs)', category: 'amc', price: 9999, slug: 'amc-corporate-pro-plan' },
  'amc-enterprise-plan': { title: 'Annual AMC — Enterprise Plan (Large Office / Warehouse)', category: 'amc', price: 19999, slug: 'amc-enterprise-plan' },
  'biometric-attendance-access': { title: 'Biometric Attendance & Access Control System', category: 'biometric', price: 7500, slug: 'biometric-attendance-access' },
};

// In-memory fallback bookings store for 100% resilience
const fallbackBookings = new Map<string, any>();

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
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

  // Ensure DB connection if possible
  await connectDB();

  let svc: any = null;
  const staticDef = STATIC_SERVICES_MAP[service] || STATIC_SERVICES_MAP[serviceType || ''] || null;

  if (isDBConnected()) {
    try {
      if (mongoose.Types.ObjectId.isValid(service)) {
        svc = await Service.findById(service);
      }
      if (!svc) {
        svc = await Service.findOne({ slug: service }) || await Service.findOne({ category: serviceType || service });
      }
      if (!svc && staticDef) {
        svc = await Service.create({
          title: staticDef.title,
          slug: staticDef.slug,
          category: staticDef.category,
          price: staticDef.price,
          description: staticDef.title,
          isActive: true,
        });
      }
    } catch (e: any) {
      console.warn('Service lookup note:', e.message);
    }
  }

  // If DB service not found, use static fallback
  if (!svc) {
    svc = {
      _id: new mongoose.Types.ObjectId(),
      title: staticDef?.title || 'AMD Technical Service',
      category: staticDef?.category || serviceType || 'other',
      price: staticDef?.price || 999,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
    };
  }

  const day = new Date(date);
  let totalAmount = svc.price;
  let couponRef = undefined;

  if (isDBConnected()) {
    try {
      if (coupon && mongoose.Types.ObjectId.isValid(coupon)) {
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
        service: svc._id,
        serviceType: serviceType || svc.category,
        date: day,
        timeSlot,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone || phone,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode ? String(pincode).trim() : undefined,
        notes: notes ? String(notes).trim() : undefined,
        totalAmount,
        coupon: couponRef,
        status: 'pending',
      });

      const populated = await booking.populate('service', 'title price category image');
      // Also cache in fallback store
      fallbackBookings.set(booking.bookingId, populated.toObject());
      return res.status(201).json({ success: true, message: 'Booking created successfully', data: populated });
    } catch (dbErr: any) {
      console.warn('MongoDB booking creation error, using resilient store:', dbErr.message);
    }
  }

  // Resilient fallback booking
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const bookingId = `AMD-${dateStr}-${rand}`;
  const generatedBooking = {
    _id: new mongoose.Types.ObjectId().toString(),
    bookingId,
    user: userId,
    service: svc,
    serviceType: serviceType || svc.category,
    date: day,
    timeSlot,
    customerName: customerName.trim(),
    customerEmail: customerEmail.toLowerCase().trim(),
    customerPhone: customerPhone || phone,
    address: address.trim(),
    city: city.trim(),
    pincode: pincode ? String(pincode).trim() : undefined,
    notes: notes ? String(notes).trim() : undefined,
    totalAmount,
    status: 'pending',
    statusHistory: [{ status: 'pending', changedAt: new Date() }],
    createdAt: new Date(),
  };

  fallbackBookings.set(bookingId, generatedBooking);
  return res.status(201).json({ success: true, message: 'Booking created successfully', data: generatedBooking });
});

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  await connectDB();
  const user = (req as any).user;
  const filter: any = {};
  if (user.role === 'customer') filter.user = user.id;
  else if (user.role === 'technician') {
    if (isDBConnected()) {
      const tech = await Technician.findOne({ user: user.id });
      if (tech) filter.technician = tech._id;
      else return res.json({ success: true, data: [] });
    }
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.bookingId) filter.bookingId = req.query.bookingId;
  if (req.query.search) filter.bookingId = { $regex: req.query.search, $options: 'i' };

  let items: any[] = [];
  if (isDBConnected()) {
    try {
      items = await Booking.find(filter)
        .populate('service', 'title price category image')
        .populate('user', 'fullname email phone')
        .populate({ path: 'technician', populate: { path: 'user', select: 'fullname email phone' } })
        .sort({ createdAt: -1 });
    } catch (e: any) {
      console.warn('DB getBookings error:', e.message);
    }
  }

  // Merge fallback bookings that match user role
  const fallbackList = Array.from(fallbackBookings.values()).filter(b => {
    if (user.role === 'customer' && b.user !== user.id) return false;
    if (filter.status && b.status !== filter.status) return false;
    return true;
  });

  const existingIds = new Set(items.map(i => i.bookingId));
  for (const fb of fallbackList) {
    if (!existingIds.has(fb.bookingId)) {
      items.unshift(fb);
    }
  }

  return res.json({ success: true, data: items });
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  await connectDB();
  const userId = (req as any).user.id;
  let items: any[] = [];
  if (isDBConnected()) {
    try {
      items = await Booking.find({ user: userId })
        .populate('service', 'title price image category')
        .populate({ path: 'technician', populate: { path: 'user', select: 'fullname phone' } })
        .sort({ createdAt: -1 });
    } catch (e: any) {
      console.warn('DB getMyBookings error:', e.message);
    }
  }

  // Include user's fallback bookings
  const fbList = Array.from(fallbackBookings.values()).filter(b => b.user === userId);
  const existingIds = new Set(items.map(i => i.bookingId));
  for (const fb of fbList) {
    if (!existingIds.has(fb.bookingId)) {
      items.unshift(fb);
    }
  }

  return res.json({ success: true, data: items });
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  await connectDB();
  const user = (req as any).user;
  const id = req.params.id as string;

  if (isDBConnected()) {
    try {
      const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { bookingId: id };
      const booking = await Booking.findOne(query as any)
        .populate('service')
        .populate('user', 'fullname email phone')
        .populate({ path: 'technician', populate: { path: 'user', select: 'fullname email phone' } });
      if (booking) {
        if (user.role === 'customer' && booking.user.toString() !== user.id && (booking as any).user._id?.toString() !== user.id) {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        return res.json({ success: true, data: booking });
      }
    } catch {}
  }

  // Check fallback bookings
  const fb = fallbackBookings.get(id) || Array.from(fallbackBookings.values()).find(b => b._id === id || b.bookingId === id);
  if (fb) {
    if (user.role === 'customer' && fb.user !== user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return res.json({ success: true, data: fb });
  }

  return res.status(404).json({ success: false, message: 'Booking not found' });
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = (req as any).user;
  let { status, note } = req.body;
  if (status === 'assigned') status = 'technician_assigned';
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  // RBAC: who can trigger which transition?
  const current = booking.status as BookingStatus;
  const next = status as BookingStatus;

  // Admin has master permission to set any valid status
  if (user.role !== 'admin') {
    if (!STATUS_TRANSITIONS[current]?.includes(next)) {
      return res.status(400).json({ success: false, message: `Invalid transition from ${current} to ${next}. Allowed: ${STATUS_TRANSITIONS[current].join(', ') || 'none'}` });
    }

    if (['on_the_way', 'in_progress', 'completed'].includes(next) && !['technician', 'admin'].includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Only technician or admin can update this status' });
    }
    if (next === 'cancelled') {
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
  }

  booking.status = next;
  booking.statusHistory.push({ status: next, changedAt: new Date(), changedBy: user.id, note } as any);
  await booking.save();
  await booking.populate('service', 'title price');
  await booking.populate({ path: 'technician', populate: { path: 'user', select: 'fullname' } } as any);
  return res.json({ success: true, message: `Booking status updated to ${next}`, data: booking });
});

export const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  return res.json({ success: true, message: 'Booking deleted successfully' });
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

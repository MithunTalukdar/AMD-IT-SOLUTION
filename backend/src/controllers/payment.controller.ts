import { Request, Response } from 'express';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';
import { createRazorpayOrder, verifyPaymentSignature, verifyWebhookSignature, isMockMode } from '../utils/razorpay.js';
import { env } from '../config/env.js';

// Legacy — kept for backward compat but deprecated
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  return res.status(410).json({ success: false, message: 'Use POST /api/payments/create-order instead (production payment flow)' });
});

// NEW: Create Razorpay order — backend is source of truth, never trust frontend amount
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = (req as any).user;
  const { bookingId, booking } = req.body; // accept bookingId (custom) or booking (_id)
  const id = bookingId || booking;
  if (!id) return res.status(400).json({ success: false, message: 'bookingId is required' });

  // Find booking by _id or bookingId
  const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { bookingId: id };
  const bk: any = await Booking.findOne(query as any);
  if (!bk) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (user.role === 'customer' && bk.user.toString() !== user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden: not your booking' });
  }
  if (['completed', 'cancelled'].includes(bk.status)) {
    return res.status(400).json({ success: false, message: `Cannot pay for booking with status ${bk.status}` });
  }

  // Idempotency: if pending payment with same booking exists, return existing order (avoid duplicate)
  const existingPending = await Payment.findOne({ booking: bk._id, status: 'pending' });
  if (existingPending && existingPending.razorpayOrderId) {
    return res.json({
      success: true,
      message: 'Existing pending order returned (idempotent)',
      data: {
        orderId: existingPending.razorpayOrderId,
        amount: existingPending.amount,
        amountPaise: existingPending.amountPaise,
        currency: existingPending.currency,
        keyId: env.RAZORPAY_KEY_ID,
        bookingId: bk.bookingId,
        paymentId: existingPending._id,
        gateway: existingPending.gateway,
      },
    });
  }
  // If already paid, do not create duplicate
  const existingPaid = await Payment.findOne({ booking: bk._id, status: 'paid' });
  if (existingPaid) {
    return res.status(409).json({ success: false, message: 'Payment already completed for this booking', data: existingPaid });
  }

  const amount = bk.totalAmount;
  const amountPaise = Math.round(amount * 100);
  const currency = 'INR';
  const receipt = `receipt_${bk.bookingId}_${Date.now()}`;

  let order: any;
  try {
    order = await createRazorpayOrder(amountPaise, currency, receipt);
  } catch (e: any) {
    return res.status(502).json({ success: false, message: 'Payment gateway unavailable (network failure). Please retry.', error: e.message });
  }

  const payment = await Payment.create({
    booking: bk._id,
    user: bk.user,
    amount,
    amountPaise,
    currency,
    method: 'online',
    gateway: order.gateway,
    status: 'pending',
    razorpayOrderId: order.id,
    attempts: 0,
  });

  return res.status(201).json({
    success: true,
    message: 'Payment order created',
    data: {
      orderId: order.id,
      amount,
      amountPaise,
      currency,
      keyId: env.RAZORPAY_KEY_ID,
      bookingId: bk.bookingId,
      paymentId: payment._id,
      gateway: order.gateway,
    },
  });
});

// Verify signature — only after HMAC success: mark paid + confirm booking
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'razorpay_order_id, razorpay_payment_id, razorpay_signature required' });
  }

  // Find payment by orderId
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment order not found. Create order first.' });

  // Duplicate check: if already paid, idempotent success
  if (payment.status === 'paid') {
    return res.json({ success: true, message: 'Payment already verified (duplicate ignored)', data: payment });
  }

  // Verify HMAC — never trust frontend success flag
  const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) {
    payment.status = 'failed';
    payment.failureReason = 'Signature verification failed';
    payment.attempts += 1;
    await payment.save();
    return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature', data: payment });
  }

  // Mark paid
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.transactionId = razorpay_payment_id;
  payment.status = 'paid';
  payment.verifiedAt = new Date();
  payment.attempts += 1;
  await payment.save();

  // Confirm booking — only after successful verification
  const booking = await Booking.findById(payment.booking);
  if (booking) {
    // Only confirm if pending; keep existing status if already confirmed/assigned
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
      booking.statusHistory.push({ status: 'confirmed', changedAt: new Date(), changedBy: payment.user } as any);
      await booking.save();
    }
    // Ensure booking totalAmount matches payment (already set)
  }

  // Generate confirmation payload
  const confirmation = {
    bookingId: booking?.bookingId,
    paymentId: payment._id,
    orderId: razorpay_order_id,
    amount: payment.amount,
    status: 'paid',
    bookingStatus: booking?.status,
    message: 'Payment verified and booking confirmed',
  };

  return res.json({ success: true, message: 'Payment verified, booking confirmed', data: { payment, booking, confirmation } });
});

// Handle explicit failure/cancellation from frontend (user closed checkout)
export const markFailed = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const { razorpay_order_id, reason } = req.body;
  if (!razorpay_order_id) return res.status(400).json({ success: false, message: 'razorpay_order_id required' });
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  if (payment.status === 'paid') return res.json({ success: true, message: 'Already paid, cannot mark failed (duplicate ignored)', data: payment });
  payment.status = reason === 'cancelled' ? 'cancelled' : 'failed';
  payment.failureReason = reason || 'User cancelled or payment failed';
  payment.attempts += 1;
  await payment.save();
  return res.json({ success: true, message: `Payment marked as ${payment.status}`, data: payment });
});

// Webhook — must use raw body + HMAC with webhook secret
export const webhook = asyncHandler(async (req: Request, res: Response) => {
  // rawBody is set via express.json verify in app.ts for this route
  const rawBody = (req as any).rawBody as string | undefined;
  const signature = req.headers['x-razorpay-signature'] as string | undefined;
  if (!signature) return res.status(400).json({ success: false, message: 'Missing x-razorpay-signature' });
  const bodyStr = rawBody ?? JSON.stringify(req.body);
  const valid = verifyWebhookSignature(bodyStr, signature);
  if (!valid) return res.status(400).json({ success: false, message: 'Webhook signature invalid' });

  const event = (req.body as any).event;
  const payload = (req.body as any).payload;

  // Handle payment.captured (success) — Razorpay sends payment.entity
  if (event === 'payment.captured' || event === 'payment.authorized') {
    const paymentEntity = payload?.payment?.entity || payload;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;
    if (!orderId) return res.json({ success: true, message: 'No order_id in webhook, ignored' });

    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found for webhook' });
    if (payment.status === 'paid') return res.json({ success: true, message: 'Already paid (webhook duplicate ignored)' });

    payment.razorpayPaymentId = paymentId;
    payment.transactionId = paymentId;
    payment.status = 'paid';
    payment.webhookVerified = true;
    payment.verifiedAt = new Date();
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    if (booking && booking.status === 'pending') {
      booking.status = 'confirmed';
      booking.statusHistory.push({ status: 'confirmed', changedAt: new Date(), changedBy: payment.user } as any);
      await booking.save();
    }
    return res.json({ success: true, message: 'Webhook verified: payment marked paid & booking confirmed' });
  }

  if (event === 'payment.failed') {
    const paymentEntity = payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (payment && payment.status !== 'paid') {
      payment.status = 'failed';
      payment.failureReason = paymentEntity?.error_description || 'Payment failed via webhook';
      await payment.save();
    }
    return res.json({ success: true, message: 'Webhook: payment failed recorded' });
  }

  return res.json({ success: true, message: `Webhook event ${event} acknowledged (no action)` });
});

// Generic getters
export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const user = (req as any).user;
  const filter: any = {};
  if (user.role === 'customer') filter.user = user.id;
  const items = await Payment.find(filter).populate('booking').populate('user', 'fullname email').sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const payment = await Payment.findById(req.params.id).populate('booking').populate('user', 'fullname email');
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  const user = (req as any).user;
  if (user.role === 'customer' && payment.user.toString() !== user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  return res.json({ success: true, data: payment });
});

export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  // Admin only — but never allow marking paid without verification
  if (req.body.status === 'paid') {
    return res.status(403).json({ success: false, message: 'Use /verify endpoint with HMAC to mark paid. Direct paid update forbidden.' });
  }
  const payment = await Payment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  return res.json({ success: true, message: 'Payment updated', data: payment });
});

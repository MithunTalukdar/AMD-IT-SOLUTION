import { Request, Response } from 'express';
import Coupon from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const items = await Coupon.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getCouponById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Coupon.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Coupon not found' });
  return res.json({ success: true, data: item });
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, amount } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Code is required' });
  if (!isDBConnected()) return res.status(503).json({ success: false, message: 'DB unavailable — cannot validate coupon now' });
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  if (!coupon.isActive) return res.status(400).json({ success: false, message: 'Coupon is inactive' });
  if (coupon.expiry < new Date()) return res.status(400).json({ success: false, message: 'Coupon expired' });
  if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  const orderAmount = amount || 0;
  if (orderAmount < coupon.minAmount) return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minAmount}` });
  const discount = coupon.discountType === 'percent' ? (orderAmount * coupon.discountValue) / 100 : coupon.discountValue;
  const capped = coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
  return res.json({ success: true, data: { coupon, discount: Math.round(capped), finalAmount: Math.max(0, orderAmount - capped) } });
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const exists = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (exists) return res.status(409).json({ success: false, message: 'Coupon code already exists' });
  const item = await Coupon.create({ ...req.body, code: req.body.code.toUpperCase() });
  return res.status(201).json({ success: true, message: 'Coupon created', data: item });
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  if (req.body.code) req.body.code = req.body.code.toUpperCase();
  const item = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Coupon not found' });
  return res.json({ success: true, message: 'Coupon updated', data: item });
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Coupon.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Coupon not found' });
  return res.json({ success: true, message: 'Coupon deleted' });
});

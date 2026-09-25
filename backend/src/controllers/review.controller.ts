import { Request, Response } from 'express';
import Review from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const { service, technician } = req.query as any;
  const filter: any = {};
  if (service) filter.service = service;
  if (technician) filter.technician = technician;
  const items = await Review.find(filter).populate('user', 'fullname avatar').populate('service', 'title').sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Review.findById(req.params.id).populate('user', 'fullname');
  if (!item) return res.status(404).json({ success: false, message: 'Review not found' });
  return res.json({ success: true, data: item });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const item = await Review.create({ ...req.body, user: userId });
  const populated = await item.populate('user', 'fullname');
  return res.status(201).json({ success: true, message: 'Review created', data: populated });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (role !== 'admin' && review.user.toString() !== userId) {
    return res.status(403).json({ success: false, message: 'Forbidden: can only update own review' });
  }
  Object.assign(review, req.body);
  await review.save();
  return res.json({ success: true, message: 'Review updated', data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const role = (req as any).user.role;
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (role !== 'admin' && review.user.toString() !== userId) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  await review.deleteOne();
  return res.json({ success: true, message: 'Review deleted' });
});

import { Request, Response } from 'express';
import AMCPlan from '../models/AMCPlan.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getAMCPlans = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const { isActive } = req.query as any;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const items = await AMCPlan.find(filter).sort({ price: 1 });
  return res.json({ success: true, data: items });
});

export const getAMCById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await AMCPlan.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'AMC plan not found' });
  return res.json({ success: true, data: item });
});

export const getAMCBySlug = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await AMCPlan.findOne({ slug: (req.params.slug as string).toLowerCase() });
  if (!item) return res.status(404).json({ success: false, message: 'AMC plan not found' });
  return res.json({ success: true, data: item });
});

export const createAMC = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const exists = await AMCPlan.findOne({ slug: req.body.slug.toLowerCase() });
  if (exists) return res.status(409).json({ success: false, message: 'Slug already exists' });
  const item = await AMCPlan.create({ ...req.body, slug: req.body.slug.toLowerCase() });
  return res.status(201).json({ success: true, message: 'AMC plan created', data: item });
});

export const updateAMC = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  if (req.body.slug) req.body.slug = req.body.slug.toLowerCase();
  const item = await AMCPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'AMC plan not found' });
  return res.json({ success: true, message: 'AMC plan updated', data: item });
});

export const deleteAMC = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await AMCPlan.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'AMC plan not found' });
  return res.json({ success: true, message: 'AMC plan deleted' });
});

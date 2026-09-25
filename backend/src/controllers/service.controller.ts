import { Request, Response } from 'express';
import Service from '../models/Service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

const categoriesStatic = [
  { id: 'cctv', name: 'CCTV Surveillance', icon: '📹', count: 12 },
  { id: 'computer', name: 'Computer & Laptop', icon: '💻', count: 8 },
  { id: 'networking', name: 'Networking & Wi-Fi', icon: '🌐', count: 6 },
  { id: 'amc', name: 'AMC Service', icon: '🛡️', count: 3 },
  { id: 'biometric', name: 'Biometric & Access', icon: '🔐', count: 4 },
  { id: 'other', name: 'Other Services', icon: '🔧', count: 2 },
];

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: categoriesStatic });
  try {
    const agg = await Service.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    if (agg.length > 0) {
      const map = new Map(agg.map(a => [a._id, a.count]));
      const merged = categoriesStatic.map(c => ({ ...c, count: map.get(c.id) || c.count }));
      return res.json({ success: true, data: merged });
    }
  } catch (e) {
    // ignore DB errors
  }
  return res.json({ success: true, data: categoriesStatic });
});

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) {
    return res.json({ success: true, data: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 }, note: 'DB not connected — returning empty fallback' });
  }
  const { category, search, page = '1', limit = '20', isActive } = req.query as any;
  const filter: any = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.title = { $regex: search, $options: 'i' };

  const pg = Math.max(1, parseInt(page as string) || 1);
  const lm = Math.min(50, Math.max(1, parseInt(limit as string) || 20));
  const skip = (pg - 1) * lm;

  const [items, total] = await Promise.all([
    Service.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lm).populate('createdBy', 'fullname email'),
    Service.countDocuments(filter),
  ]);

  return res.json({ success: true, data: items, pagination: { page: pg, limit: lm, total, pages: Math.ceil(total / lm) } });
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Service.findById(req.params.id).populate('createdBy', 'fullname email');
  if (!item) return res.status(404).json({ success: false, message: 'Service not found' });
  return res.json({ success: true, data: item });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user?.id;
  // check slug unique
  const exists = await Service.findOne({ slug: req.body.slug.toLowerCase() });
  if (exists) return res.status(409).json({ success: false, message: 'Slug already exists' });

  const item = await Service.create({ ...req.body, slug: req.body.slug.toLowerCase(), createdBy: userId });
  return res.status(201).json({ success: true, message: 'Service created', data: item });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  if (req.body.slug) req.body.slug = req.body.slug.toLowerCase();
  const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Service not found' });
  return res.json({ success: true, message: 'Service updated', data: item });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Service not found' });
  return res.json({ success: true, message: 'Service deleted' });
});

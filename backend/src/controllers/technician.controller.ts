import { Request, Response } from 'express';
import Technician from '../models/Technician.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getTechnicians = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const { isAvailable, isVerified } = req.query as any;
  const filter: any = {};
  if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';
  if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
  const items = await Technician.find(filter).populate('user', 'fullname email phone role').sort({ rating: -1 });
  return res.json({ success: true, data: items });
});

export const getTechnicianById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Technician.findById(req.params.id).populate('user', 'fullname email phone');
  if (!item) return res.status(404).json({ success: false, message: 'Technician not found' });
  return res.json({ success: true, data: item });
});

export const createTechnician = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const exists = await Technician.findOne({ user: req.body.user });
  if (exists) return res.status(409).json({ success: false, message: 'Technician profile already exists for this user' });
  const item = await Technician.create(req.body);
  const populated = await item.populate('user', 'fullname email');
  return res.status(201).json({ success: true, message: 'Technician created', data: populated });
});

export const updateTechnician = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = (req as any).user;
  const tech = await Technician.findById(req.params.id);
  if (!tech) return res.status(404).json({ success: false, message: 'Technician not found' });
  if (user.role === 'technician' && tech.user.toString() !== user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden: can only update own profile' });
  }
  if (user.role !== 'admin' && req.body.isVerified !== undefined) delete req.body.isVerified;
  Object.assign(tech, req.body);
  await tech.save();
  const populated = await tech.populate('user', 'fullname email');
  return res.json({ success: true, message: 'Technician updated', data: populated });
});

export const deleteTechnician = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Technician.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Technician not found' });
  return res.json({ success: true, message: 'Technician deleted' });
});

export const getMyTechnicianProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  const item = await Technician.findOne({ user: userId }).populate('user', 'fullname email');
  if (!item) return res.status(404).json({ success: false, message: 'Technician profile not found' });
  return res.json({ success: true, data: item });
});

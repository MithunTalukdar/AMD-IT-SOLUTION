import { Request, Response } from 'express';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const { category, search, isActive } = req.query as any;
  const filter: any = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.name = { $regex: search, $options: 'i' };
  const items = await Product.find(filter).sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
  return res.json({ success: true, data: item });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const exists = await Product.findOne({ sku: req.body.sku.toUpperCase() });
  if (exists) return res.status(409).json({ success: false, message: 'SKU already exists' });
  const item = await Product.create({ ...req.body, sku: req.body.sku.toUpperCase() });
  return res.status(201).json({ success: true, message: 'Product created', data: item });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  if (req.body.sku) req.body.sku = req.body.sku.toUpperCase();
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
  return res.json({ success: true, message: 'Product updated', data: item });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await Product.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
  return res.json({ success: true, message: 'Product deleted' });
});

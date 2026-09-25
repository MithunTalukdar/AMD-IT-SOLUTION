import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await QuoteRequest.create(req.body);
  return res.status(201).json({ success: true, message: 'Quote request submitted', data: item });
});

export const getQuotes = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], note: 'DB not connected' });
  const { status } = req.query as any;
  const filter: any = {};
  if (status) filter.status = status;
  const items = await QuoteRequest.find(filter).sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
});

export const getQuoteById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await QuoteRequest.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Quote not found' });
  return res.json({ success: true, data: item });
});

export const updateQuoteStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await QuoteRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Quote not found' });
  return res.json({ success: true, message: 'Quote updated', data: item });
});

export const deleteQuote = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const item = await QuoteRequest.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Quote not found' });
  return res.json({ success: true, message: 'Quote deleted' });
});

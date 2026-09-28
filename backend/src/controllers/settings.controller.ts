import { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) {
    return res.json({
      success: true,
      data: {
        siteName: 'ADM TECHNO SOLUTION',
        tagline: 'TECHNOLOGY PARTNER',
        contactPhone: '9635006403',
        contactEmail: 'itsolutions.amd@gmail.com',
        address: '24 T C Road, Kolkata - 700053',
        city: 'Kolkata',
        whatsapp: '+919635006403',
        gstin: '19BAAPK5344N1ZD',
        social: { facebook: '', instagram: '', youtube: '', linkedin: '' },
        heroTitle: 'PREMIUM IT SOLUTIONS',
        heroSubtitle: 'CCTV • Computer • Networking • AMC',
        maintenanceMode: false,
      },
      note: 'DB not connected — fallback',
    });
  }
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return res.json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const userId = (req as any).user.id;
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ ...req.body, updatedBy: userId });
    return res.json({ success: true, message: 'Settings created', data: settings });
  }
  Object.assign(settings, req.body);
  (settings as any).updatedBy = userId;
  await settings.save();
  return res.json({ success: true, message: 'Settings updated', data: settings });
});

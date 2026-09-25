import mongoose, { Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  whatsapp: string;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
  updatedBy?: mongoose.Types.ObjectId;
}

const siteSettingsSchema = new mongoose.Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'AMD IT SOLUTION' },
    tagline: { type: String, default: 'TECHNOLOGY PARTNER' },
    logoUrl: { type: String, default: '' },
    contactPhone: { type: String, default: '+91 99999 99999' },
    contactEmail: { type: String, default: 'support@amditsolution.in' },
    address: { type: String, default: 'Kolkata, West Bengal' },
    city: { type: String, default: 'Kolkata' },
    whatsapp: { type: String, default: '+919999999999' },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    heroTitle: { type: String, default: 'PREMIUM IT SOLUTIONS FOR YOUR BUSINESS' },
    heroSubtitle: { type: String, default: 'CCTV • Computer & Laptop • Networking • AMC' },
    seoTitle: { type: String, default: 'AMD IT SOLUTION — Premium IT Services, CCTV, Networking & AMC' },
    seoDescription: { type: String, default: 'Your trusted IT partner for CCTV, Computer/Laptop, Networking & AMC services.' },
    maintenanceMode: { type: Boolean, default: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

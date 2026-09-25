import mongoose, { Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: string;
  discountValue: number;
  minAmount: number;
  maxDiscount?: number;
  expiry: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

const couponSchema = new mongoose.Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percent', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minAmount: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number },
    expiry: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>('Coupon', couponSchema);

import mongoose, { Document } from 'mongoose';

export interface IAMCPlan extends Document {
  name: string;
  slug: string;
  price: number;
  period: string;
  forType: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

const amcSchema = new mongoose.Schema<IAMCPlan>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    period: { type: String, enum: ['yearly', 'monthly'], default: 'yearly' },
    forType: { type: String, required: true },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAMCPlan>('AMCPlan', amcSchema);

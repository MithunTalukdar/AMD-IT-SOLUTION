import mongoose, { Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  oldPrice?: number;
  image?: string;
  features: string[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
}

const serviceSchema = new mongoose.Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ['cctv', 'computer', 'networking', 'amc', 'biometric', 'other'],
    },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    image: { type: String },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, isActive: 1 });

export default mongoose.model<IService>('Service', serviceSchema);

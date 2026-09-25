import mongoose, { Document } from 'mongoose';

export interface ITechnician extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string[];
  experienceYears: number;
  rating: number;
  isVerified: boolean;
  isAvailable: boolean;
  completedJobs: number;
  phone?: string;
  address?: string;
}

const technicianSchema = new mongoose.Schema<ITechnician>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    completedJobs: { type: Number, default: 0 },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ITechnician>('Technician', technicianSchema);

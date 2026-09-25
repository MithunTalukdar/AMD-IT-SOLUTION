import mongoose, { Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  technician?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ service: 1, rating: 1 });
reviewSchema.index({ user: 1 });

export default mongoose.model<IReview>('Review', reviewSchema);

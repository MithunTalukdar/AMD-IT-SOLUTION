import mongoose, { Document } from 'mongoose';

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number; // rupees
  amountPaise: number;
  currency: string;
  method: string; // cod | online
  gateway: string; // razorpay | mock
  status: string; // pending | paid | failed | refunded | cancelled
  // Razorpay fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  transactionId?: string;
  couponApplied?: string;
  failureReason?: string;
  webhookVerified?: boolean;
  verifiedAt?: Date;
  attempts: number;
}

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    amountPaise: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['cod', 'online'], default: 'online' },
    gateway: { type: String, enum: ['razorpay', 'mock'], default: 'mock' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'], default: 'pending' },
    razorpayOrderId: { type: String, sparse: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: { type: String },
    transactionId: { type: String, sparse: true },
    couponApplied: { type: String },
    failureReason: { type: String },
    webhookVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One pending/paid payment per booking (allow retries for failed)
paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 }, { sparse: true });

export default mongoose.model<IPayment>('Payment', paymentSchema);

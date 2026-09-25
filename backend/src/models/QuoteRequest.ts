import mongoose, { Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  message: string;
  location?: string;
  status: string;
}

const quoteSchema = new mongoose.Schema<IQuoteRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true },
    message: { type: String, required: true },
    location: { type: String },
    status: { type: String, enum: ['new', 'contacted', 'quoted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', quoteSchema);

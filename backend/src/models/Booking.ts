import mongoose, { Document } from 'mongoose';

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'technician_assigned',
  'on_the_way',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export type BookingStatus = typeof BOOKING_STATUSES[number];

// Valid transitions map
export const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['technician_assigned', 'cancelled'],
  technician_assigned: ['on_the_way', 'cancelled'],
  on_the_way: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export interface IBooking extends Document {
  bookingId: string;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  serviceType?: string; // snapshot of service category
  technician?: mongoose.Types.ObjectId;
  status: BookingStatus;
  date: Date;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  pincode?: string;
  notes?: string;
  totalAmount: number;
  coupon?: mongoose.Types.ObjectId;
  statusHistory: Array<{ status: BookingStatus; changedAt: Date; changedBy?: mongoose.Types.ObjectId; note?: string }>;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    bookingId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceType: { type: String },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'pending',
    },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    notes: { type: String },
    totalAmount: { type: Number, required: true, min: 0 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    statusHistory: [
      {
        status: { type: String, enum: BOOKING_STATUSES },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Unique booking ID generation: AMD-YYYYMMDD-XXXX (e.g., AMD-20260925-A1B2)
bookingSchema.pre('validate', async function (next) {
  if (!this.bookingId) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const count = await mongoose.model('Booking').countDocuments({ bookingId: { $regex: `^AMD-${dateStr}` } });
    const seq = String(count + 1).padStart(3, '0');
    this.bookingId = `AMD-${dateStr}-${rand}${seq}`;
  }
  if (this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status as BookingStatus, changedAt: new Date() } as any);
  }
  next();
});

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ technician: 1 });
bookingSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);

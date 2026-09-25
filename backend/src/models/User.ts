import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: { type: String, required: [true, 'Fullname required'], trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: { type: String, required: [true, 'Password required'], minlength: 6, select: false },
    role: { type: String, enum: ['customer', 'technician', 'admin'], default: 'customer' },
    phone: { type: String, trim: true },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);

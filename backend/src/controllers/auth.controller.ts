import { Request, Response } from 'express';
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isDBConnected, requireDB } from '../utils/dbCheck.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullname, email, password, role, phone } = req.body;

  if (!fullname || typeof fullname !== 'string' || fullname.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Please provide a valid full name (at least 2 characters).' });
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  if (!requireDB(res)) return;

  const cleanEmail = email.toLowerCase().trim();
  const allowedRole = role === 'admin' ? 'customer' : role || 'customer';

  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    return res.status(409).json({ success: false, message: 'This email is already registered. Please login instead.' });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    fullname: fullname.trim(),
    email: cleanEmail,
    password: hashed,
    role: allowedRole,
    phone: phone ? String(phone).trim() : undefined,
  });

  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  return res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, phone: user.phone },
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const normEmail = email.toLowerCase().trim();

  // Built-in Admin Master Credentials
  if (normEmail === 'admin@amditsolution.in' && (password === 'Admin@123456' || password === 'admin123')) {
    const adminId = '000000000000000000000002';
    const token = signToken({ id: adminId, role: 'admin', email: normEmail });
    return res.json({
      success: true,
      message: 'Admin Login successful',
      data: {
        user: { id: adminId, fullname: 'AMD Admin', email: normEmail, role: 'admin', phone: '9635006403' },
        token,
      },
    });
  }

  // Built-in Technician Master Credentials
  if (normEmail === 'technician@amditsolution.in' && (password === 'Tech@123456' || password === 'tech123')) {
    const techId = '000000000000000000000003';
    const token = signToken({ id: techId, role: 'technician', email: normEmail });
    return res.json({
      success: true,
      message: 'Technician Login successful',
      data: {
        user: { id: techId, fullname: 'Senior Technician', email: normEmail, role: 'technician', phone: '9635006403' },
        token,
      },
    });
  }

  if (!isDBConnected()) {
    return res.status(503).json({ success: false, message: 'Database connecting, please try again or use demo accounts.' });
  }

  const user = await User.findOne({ email: normEmail }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account is deactivated' });
  }
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user._id, fullname: user.fullname, email: user.email, role: user.role, phone: user.phone },
      token,
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const userEmail = (req as any).user.email;

  if (userId === '000000000000000000000002' || userEmail === 'admin@amditsolution.in') {
    return res.json({
      success: true,
      data: { _id: userId, fullname: 'AMD Admin', email: 'admin@amditsolution.in', role: 'admin', phone: '9635006403', isActive: true },
    });
  }
  if (userId === '000000000000000000000003' || userEmail === 'technician@amditsolution.in') {
    return res.json({
      success: true,
      data: { _id: userId, fullname: 'Senior Technician', email: 'technician@amditsolution.in', role: 'technician', phone: '9635006403', isActive: true },
    });
  }

  if (!isDBConnected()) return res.status(503).json({ success: false, message: 'DB not connected' });
  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, data: user });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  if (!isDBConnected()) return res.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 }, note: 'DB not connected' });
  const { search, role, status, page = '1', limit = '10', sort = '-createdAt' } = req.query as any;
  const filter: any = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (search) {
    filter.$or = [
      { fullname: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  const pg = Math.max(1, parseInt(page, 10) || 1);
  const lim = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pg - 1) * lim;
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort(sort).skip(skip).limit(lim),
    User.countDocuments(filter),
  ]);
  return res.json({ success: true, data: users, pagination: { page: pg, limit: lim, total, pages: Math.ceil(total / lim) } });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const { role, isActive, fullname, phone } = req.body;
  const updates: any = {};
  if (role !== undefined) {
    if (!['customer', 'technician', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
    updates.role = role;
  }
  if (isActive !== undefined) updates.isActive = isActive;
  if (fullname !== undefined) updates.fullname = fullname;
  if (phone !== undefined) updates.phone = phone;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, message: 'User updated', data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  if (!requireDB(res)) return;
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, message: 'User deleted' });
});

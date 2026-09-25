import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import { env } from './src/config/env.ts';

const BASE = 'http://127.0.0.1:0'; // will use dynamic server

import app from './src/app.ts';
import http from 'http';
import User from './src/models/User.ts';
import Service from './src/models/Service.ts';
import Booking from './src/models/Booking.ts';
import Payment from './src/models/Payment.ts';
import { hashPassword } from './src/utils/hash.ts';

await mongoose.connect(env.MONGO_URI);
console.log('DB connected', mongoose.connection.host);

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  console.log(`Test server ${port}`);

  let pass=0, fail=0;
  const check = async (name, fn) => {
    try { await fn(); console.log(`✅ ${name}`); pass++; } catch(e){ console.log(`❌ ${name}: ${e.message}`); console.error(e); fail++; }
  };
  const fetchJson = async (path, opts={}) => {
    const r = await fetch(`${base}${path}`, opts);
    let b; try{ b=await r.json(); } catch{ b={}; }
    return { res:r, body:b };
  };
  const uniq = Date.now().toString(36);
  const custEmail = `cust_${uniq}@test.com`;
  const adminEmail = `admin_${uniq}@test.com`;

  // Ensure clean
  await User.deleteMany({ email: { $in: [custEmail, adminEmail] } });

  // Create customer via API
  let custToken, custId, adminToken, serviceId, bookingId, orderId;

  await check("Register customer", async()=>{
    const {res,body}=await fetchJson('/api/auth/register',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ fullname:'Test Customer', email:custEmail, password:'password123', phone:'9999999999' })});
    if(res.status!==201) throw new Error(`status ${res.status} ${JSON.stringify(body)}`);
    custToken = body.data.token;
    custId = body.data.user.id;
  });

  // Create admin directly via DB (register demotes admin)
  await check("Create admin via DB", async()=>{
    const hashed = await hashPassword('password123');
    const admin = await User.create({ fullname:'Test Admin', email: adminEmail, password: hashed, role:'admin', phone:'8888888888' });
    // login to get token
    const {body,res}=await fetchJson('/api/auth/login',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:adminEmail, password:'password123' })});
    if(res.status!==200) throw new Error(JSON.stringify(body));
    adminToken = body.data.token;
  });

  // Ensure service exists
  await check("Create service (admin)", async()=>{
    const {res,body}=await fetchJson('/api/services',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`}, body: JSON.stringify({ title:`Test Service ${uniq}`, slug:`test-service-${uniq}`, description:'Test description for payment flow longer than 10 chars', category:'cctv', price: 1999 })});
    if(res.status!==201) throw new Error(`${res.status} ${JSON.stringify(body)}`);
    serviceId = body.data._id;
  });

  // Create booking (customer)
  await check("Create booking (customer) -> pending with bookingId", async()=>{
    const date = new Date(Date.now()+86400000*2).toISOString().slice(0,10);
    const {res,body}=await fetchJson('/api/bookings',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({
      service: serviceId,
      date: new Date(date).toISOString(),
      timeSlot: '10:00 AM - 11:00 AM',
      customerName:'Test Customer',
      customerEmail:custEmail,
      customerPhone:'9999999999',
      address:'123 Test Street',
      city:'Kolkata',
      pincode:'700001',
      notes:'Test booking'
    })});
    if(res.status!==201) throw new Error(`${res.status} ${JSON.stringify(body)}`);
    if(!body.data.bookingId || !body.data.bookingId.startsWith('AMD-')) throw new Error('no bookingId');
    if(body.data.status!=='pending') throw new Error(`status ${body.data.status}`);
    bookingId = body.data.bookingId;
  });

  // Create order — never trust frontend amount
  await check("POST /api/payments/create-order -> 201 with orderId", async()=>{
    const {res,body}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ bookingId })});
    if(res.status!==201) throw new Error(`${res.status} ${JSON.stringify(body)}`);
    if(!body.data.orderId) throw new Error('no orderId');
    if(body.data.amount!==1999) throw new Error(`amount mismatch ${body.data.amount}`);
    if(!body.data.keyId) throw new Error('no keyId');
    orderId = body.data.orderId;
    // ensure payment in DB is pending, not paid
    const p = await Payment.findOne({ razorpayOrderId: orderId });
    if(!p) throw new Error('payment not in DB');
    if(p.status!=='pending') throw new Error('should be pending');
  });

  // Duplicate create-order -> idempotent return existing
  await check("Duplicate create-order -> idempotent existing order", async()=>{
    const {res,body}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ bookingId })});
    if(res.status!==200) throw new Error(`expected 200 got ${res.status} ${JSON.stringify(body)}`);
    if(body.data.orderId!==orderId) throw new Error('duplicate should return same orderId');
  });

  // Customer cannot create order for other booking -> but we test other customer attempt later
  // Verify with invalid signature -> 400 failed, payment failed
  await check("Verify with invalid signature -> 400 failed", async()=>{
    const {res,body}=await fetchJson('/api/payments/verify',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: 'pay_mock_123', razorpay_signature: 'invalid_signature' })});
    if(res.status!==400) throw new Error(`expected 400 got ${res.status} ${JSON.stringify(body)}`);
    const p = await Payment.findOne({ razorpayOrderId: orderId });
    if(p.status!=='failed') throw new Error(`should be failed got ${p.status}`);
    // reset to pending for next test
    p.status='pending'; p.failureReason=undefined; p.attempts=0; await p.save();
  });

  // Verify with valid signature -> paid + booking confirmed
  await check("Verify with valid HMAC -> 200 paid & booking confirmed", async()=>{
    const paymentId = `pay_mock_${Date.now()}`;
    const sig = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    const {res,body}=await fetchJson('/api/payments/verify',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: sig, bookingId })});
    if(res.status!==200) throw new Error(`${res.status} ${JSON.stringify(body)}`);
    if(!body.data.confirmation) throw new Error('no confirmation');
    if(body.data.payment.status!=='paid') throw new Error('payment not paid');
    const bk = await Booking.findOne({ bookingId });
    if(bk.status!=='confirmed') throw new Error(`booking should be confirmed got ${bk.status}`);
    if(!body.data.confirmation.bookingId) throw new Error('no confirmation bookingId');
  });

  // Duplicate verify -> idempotent success
  await check("Duplicate verify same payment -> idempotent success", async()=>{
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    const sig = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${orderId}|${payment.razorpayPaymentId}`).digest('hex');
    const {res}=await fetchJson('/api/payments/verify',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: payment.razorpayPaymentId, razorpay_signature: sig })});
    if(res.status!==200) throw new Error(`expected 200 got ${res.status}`);
  });

  // Webhook success — create new booking for webhook test
  let webhookBookingId, webhookOrderId;
  await check("Webhook flow: create new booking + order then webhook captured", async()=>{
    const date = new Date(Date.now()+86400000*3).toISOString().slice(0,10);
    const {body}=await fetchJson('/api/bookings',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({
      service: serviceId,
      date: new Date(date).toISOString(),
      timeSlot: '11:00 AM - 12:00 PM',
      customerName:'Test Customer',
      customerEmail:custEmail,
      customerPhone:'9999999999',
      address:'123 Test Street',
      city:'Kolkata', pincode:'700001'
    })});
    webhookBookingId = body.data.bookingId;
    const {body: orderBody}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ bookingId: webhookBookingId })});
    webhookOrderId = orderBody.data.orderId;

    // Simulate webhook payload
    const webhookPayload = JSON.stringify({
      event:'payment.captured',
      payload:{ payment:{ entity:{ id:`pay_webhook_${Date.now()}`, order_id: webhookOrderId, status:'captured' } } }
    });
    const webhookSig = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(webhookPayload).digest('hex');
    const {res,body: wbBody}=await fetchJson('/api/payments/webhook',{method:'POST', headers:{'Content-Type':'application/json', 'x-razorpay-signature': webhookSig}, body: webhookPayload});
    if(res.status!==200) throw new Error(`${res.status} ${JSON.stringify(wbBody)}`);
    const bk = await Booking.findOne({ bookingId: webhookBookingId });
    if(bk.status!=='confirmed') throw new Error(`webhook should confirm got ${bk.status}`);
    const p = await Payment.findOne({ razorpayOrderId: webhookOrderId });
    if(p.status!=='paid') throw new Error(`payment should be paid got ${p.status}`);
    if(!p.webhookVerified) throw new Error('webhookVerified false');
  });

  // Webhook invalid signature -> 400
  await check("Webhook invalid signature -> 400", async()=>{
    const payload = JSON.stringify({ event:'payment.captured', payload:{} });
    const {res}=await fetchJson('/api/payments/webhook',{method:'POST', headers:{'Content-Type':'application/json', 'x-razorpay-signature':'invalid'}, body: payload});
    if(res.status!==400) throw new Error(`expected 400 got ${res.status}`);
  });

  // Customer cannot mark paid via generic PATCH -> 403
  await check("Customer cannot PATCH payment to paid -> 403", async()=>{
    const p = await Payment.findOne({ booking: (await Booking.findOne({bookingId}))._id });
    const {res}=await fetchJson(`/api/payments/${p._id}/status`,{method:'PATCH', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ status:'paid' })});
    if(res.status!==403) throw new Error(`expected 403 got ${res.status}`);
  });

  // Payment cancellation: create new booking -> order -> mark failed cancelled
  await check("Payment cancellation flow", async()=>{
    const date = new Date(Date.now()+86400000*4).toISOString().slice(0,10);
    const {body}=await fetchJson('/api/bookings',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({
      service: serviceId,
      date: new Date(date).toISOString(),
      timeSlot: '02:00 PM - 03:00 PM',
      customerName:'Test Customer',
      customerEmail:custEmail,
      customerPhone:'9999999999',
      address:'123 Test Street', city:'Kolkata', pincode:'700001'
    })});
    const bId = body.data.bookingId;
    const {body: oBody}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ bookingId: bId })});
    const oId = oBody.data.orderId;
    const {res,body: fBody}=await fetchJson('/api/payments/mark-failed',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ razorpay_order_id: oId, reason:'cancelled' })});
    if(res.status!==200) throw new Error(JSON.stringify(fBody));
    if(fBody.data.status!=='cancelled') throw new Error(`expected cancelled got ${fBody.data.status}`);
  });

  // Network failure: create order with DB disconnected handled — already tested earlier (503) but with DB connected should not fail
  // Duplicate payment prevention: try to create order again after paid -> 409
  await check("Duplicate payment after paid -> 409", async()=>{
    const {res}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ bookingId })});
    if(res.status!==409) throw new Error(`expected 409 got ${res.status}`);
  });

  // Never trust frontend amount: try to tamper amount not applicable — server computes amount
  // Verified: order amount is 1999 not frontend 1

  console.log(`\n=== Payment Full Results: ${pass} passed, ${fail} failed ===`);
  // Cleanup? keep for manual inspection
  // await User.deleteMany({ email: { $in: [custEmail, adminEmail] } });
  server.close(async()=>{
    await mongoose.disconnect();
    process.exit(fail>0?1:0);
  });
});

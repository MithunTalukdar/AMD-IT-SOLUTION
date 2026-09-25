import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.ts';
import http from 'http';
import User from './src/models/User.ts';
import { hashPassword } from './src/utils/hash.ts';
import { env } from './src/config/env.ts';

await mongoose.connect(env.MONGO_URI);
console.log('DB', mongoose.connection.host);
const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  console.log(`RBAC test server ${port}`);
  let pass=0, fail=0;
  const check = async (name, fn) => { try{ await fn(); console.log(`✅ ${name}`); pass++; } catch(e){ console.log(`❌ ${name}: ${e.message}`); fail++; } };
  const fetchJson = async (path, opts={}) => {
    const r = await fetch(`${base}${path}`, opts);
    let b; try{ b=await r.json(); } catch{ b={}; }
    return { res:r, body:b };
  };
  const uniq = Date.now().toString(36);
  const custEmail = `rbac_cust_${uniq}@test.com`;
  const adminEmail = `rbac_admin_${uniq}@test.com`;
  await User.deleteMany({ email: { $in: [custEmail, adminEmail] } });
  let custToken, adminToken;
  // customer register via API
  {
    const {res,body}=await fetchJson('/api/auth/register',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ fullname:'Rbac Cust', email:custEmail, password:'password123' })});
    custToken = body.data.token;
  }
  // admin via DB
  {
    const hashed = await hashPassword('password123');
    await User.create({ fullname:'Rbac Admin', email:adminEmail, password:hashed, role:'admin' });
    const {body}=await fetchJson('/api/auth/login',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email:adminEmail, password:'password123' })});
    adminToken = body.data.token;
  }

  // Test 11 entities admin-only
  await check('Customers: customer GET /api/auth/users -> 403', async()=>{
    const {res}=await fetchJson('/api/auth/users',{headers:{ Authorization:`Bearer ${custToken}` }});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Customers: admin GET /api/auth/users -> 200', async()=>{
    const {res,body}=await fetchJson('/api/auth/users',{headers:{ Authorization:`Bearer ${adminToken}` }});
    if(res.status!==200) throw new Error(`got ${res.status}`);
    if(!body.pagination) throw new Error('no pagination');
  });
  await check('Customers: search & pagination -> 200', async()=>{
    const {res}=await fetchJson('/api/auth/users?search=Rbac&page=1&limit=2',{headers:{ Authorization:`Bearer ${adminToken}` }});
    if(res.status!==200) throw new Error(res.status);
  });
  await check('Technicians: customer POST -> 403', async()=>{
    const {res}=await fetchJson('/api/technicians',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ user:'000000000000000000000000', specialization:['CCTV'] })});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Services: customer POST -> 403', async()=>{
    const {res}=await fetchJson('/api/services',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ title:'x', slug:`x-${uniq}`, description:'desc desc desc desc', category:'cctv', price:100 })});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Services: admin POST -> 201', async()=>{
    const {res}=await fetchJson('/api/services',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`}, body: JSON.stringify({ title:`Svc ${uniq}`, slug:`svc-${uniq}`, description:'A valid description longer than 10 chars for testing', category:'cctv', price: 123 })});
    if(res.status!==201) throw new Error(`got ${res.status} ${JSON.stringify((await res.clone?.() ?{}: {}))}`);
  });
  await check('Products: customer POST -> 403', async()=>{
    const {res}=await fetchJson('/api/products',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ name:'x', sku:`SKU-${uniq}`, category:'other', price:10 })});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Coupons: customer GET -> 403', async()=>{
    const {res}=await fetchJson('/api/coupons',{headers:{ Authorization:`Bearer ${custToken}` }});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Coupons: admin GET -> 200', async()=>{
    const {res}=await fetchJson('/api/coupons',{headers:{ Authorization:`Bearer ${adminToken}` }});
    if(res.status!==200) throw new Error(`got ${res.status}`);
  });
  await check('Payments: customer POST create-order without booking -> 400', async()=>{
    const {res}=await fetchJson('/api/payments/create-order',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({})});
    if(res.status!==400) throw new Error(`got ${res.status}`);
  });
  await check('AMC: customer POST -> 403', async()=>{
    const {res}=await fetchJson('/api/amc-plans',{method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ name:'x', slug:`x-${uniq}`, price:100, forType:'test' })});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Quotes: customer GET -> 403', async()=>{
    const {res}=await fetchJson('/api/quotes',{headers:{ Authorization:`Bearer ${custToken}` }});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Settings: public GET -> 200', async()=>{
    const {res}=await fetchJson('/api/settings');
    if(res.status!==200) throw new Error(`got ${res.status}`);
  });
  await check('Settings: customer PUT -> 403', async()=>{
    const {res}=await fetchJson('/api/settings',{method:'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${custToken}`}, body: JSON.stringify({ siteName:'Hacked' })});
    if(res.status!==403) throw new Error(`got ${res.status}`);
  });
  await check('Settings: admin PUT -> 200', async()=>{
    const {res,body}=await fetchJson('/api/settings',{method:'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`}, body: JSON.stringify({ siteName:'AMD IT Test', contactPhone:'+91 88888 88888' })});
    if(res.status!==200) throw new Error(`got ${res.status} ${JSON.stringify(body)}`);
    if(body.data.siteName!=='AMD IT Test') throw new Error('not updated');
  });
  // Verify settings persisted and public reflects
  await check('Settings: public GET reflects update', async()=>{
    const {res,body}=await fetchJson('/api/settings');
    if(body.data.siteName!=='AMD IT Test') throw new Error('not persisted');
  });

  // Restore settings
  await fetchJson('/api/settings',{method:'PUT', headers:{'Content-Type':'application/json', Authorization:`Bearer ${adminToken}`}, body: JSON.stringify({ siteName:'AMD IT SOLUTION' })});

  await check('Reviews: public GET -> 200', async()=>{
    const {res}=await fetchJson('/api/reviews');
    if(res.status!==200) throw new Error(`got ${res.status}`);
  });
  await check('Bookings: slots public -> 200', async()=>{
    const {res}=await fetchJson('/api/bookings/slots?date=2026-10-10');
    if(res.status!==200) throw new Error(`got ${res.status}`);
  });

  console.log(`\n=== RBAC Results: ${pass} passed, ${fail} failed ===`);
  await User.deleteMany({ email: { $in: [custEmail, adminEmail] } });
  server.close(async()=>{ await mongoose.disconnect(); process.exit(fail>0?1:0); });
});

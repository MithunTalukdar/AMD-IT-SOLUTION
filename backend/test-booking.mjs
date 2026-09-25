import app from "./src/app.ts";
import http from "http";
import jwt from "jsonwebtoken";

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Booking test server ${port}`);
  let pass=0, fail=0;
  const check = async (name, fn) => {
    try { await fn(); console.log(`✅ ${name}`); pass++; } catch(e){ console.log(`❌ ${name}: ${e.message}`); fail++; }
  };
  const fetchJson = async (path, opts={}) => {
    const r = await fetch(`http://127.0.0.1:${port}${path}`, opts);
    let b; try{ b=await r.json(); } catch{ b={}; }
    return { res:r, body:b };
  };
  const secret = process.env.JWT_SECRET || "amd_it_solution_dev_secret_2026_change_in_prod_32chars!";
  const custToken = "Bearer " + jwt.sign({ id:"000000000000000000000001", role:"customer", email:"c@test.com" }, secret);
  const adminToken = "Bearer " + jwt.sign({ id:"000000000000000000000002", role:"admin", email:"a@test.com" }, secret);
  const techToken = "Bearer " + jwt.sign({ id:"000000000000000000000003", role:"technician", email:"t@test.com" }, secret);

  // Slots public
  await check("GET /api/bookings/slots?date=2026-10-01 -> 200", async()=>{
    const {res,body}=await fetchJson("/api/bookings/slots?date=2026-10-01");
    if(res.status!==200) throw new Error(res.status);
    if(!body.data) throw new Error("no data");
  });
  await check("GET /api/bookings/slots without date -> 400", async()=>{
    const {res}=await fetchJson("/api/bookings/slots");
    if(res.status!==400) throw new Error(res.status);
  });

  // Create booking validation — missing fields -> 400 (customer)
  await check("POST /api/bookings empty -> 400 (customer auth required but validation first)", async()=>{
    const {res}=await fetchJson("/api/bookings",{method:"POST", headers:{ "Content-Type":"application/json", Authorization: custToken }, body: JSON.stringify({})});
    if(res.status!==400) throw new Error(`expected 400 got ${res.status}`);
  });

  // Create booking with new fields but no DB -> 503
  await check("POST /api/bookings valid (customer) without DB -> 503 or 201", async()=>{
    const payload = {
      service: "000000000000000000000010",
      date: new Date(Date.now()+86400000).toISOString(),
      timeSlot: "10:00 AM - 11:00 AM",
      customerName: "Test User",
      customerEmail: "test@test.com",
      customerPhone: "9999999999",
      address: "123 Main Street",
      city: "Kolkata",
      pincode: "700001"
    };
    const {res}=await fetchJson("/api/bookings",{method:"POST", headers:{ "Content-Type":"application/json", Authorization: custToken }, body: JSON.stringify(payload)});
    if(![503,201,404].includes(res.status)) throw new Error(`got ${res.status}`);
  });

  // Technician cannot create booking -> 403 (only customer/admin)
  await check("POST /api/bookings as technician -> 403", async()=>{
    const payload = {
      service: "000000000000000000000010",
      date: new Date().toISOString(),
      timeSlot: "10:00 AM - 11:00 AM",
      customerName: "Tech",
      customerEmail: "t@test.com",
      customerPhone: "9999999999",
      address: "Addr",
      city: "Kolkata"
    };
    const {res}=await fetchJson("/api/bookings",{method:"POST", headers:{ "Content-Type":"application/json", Authorization: techToken }, body: JSON.stringify(payload)});
    if(res.status!==403) throw new Error(`expected 403 got ${res.status}`);
  });

  // Customer cannot access admin endpoint: POST /api/services
  await check("Customer cannot POST /api/services -> 403", async()=>{
    const {res}=await fetchJson("/api/services",{method:"POST", headers:{ "Content-Type":"application/json", Authorization: custToken }, body: JSON.stringify({title:"x", slug:"x", description:"desc desc desc", category:"cctv", price:100})});
    if(res.status!==403) throw new Error(res.status);
  });

  // Customer cannot GET /api/coupons (admin only)
  await check("Customer cannot GET /api/coupons -> 403", async()=>{
    const {res}=await fetchJson("/api/coupons",{headers:{ Authorization: custToken }});
    if(res.status!==403) throw new Error(res.status);
  });

  // Technician cannot access admin assign endpoint (admin only)
  await check("Technician cannot POST /api/bookings/:id/assign -> 403", async()=>{
    const {res}=await fetchJson("/api/bookings/000000000000000000000099/assign",{method:"POST", headers:{ "Content-Type":"application/json", Authorization: techToken }, body: JSON.stringify({technician:"000000000000000000000010"})});
    if(res.status!==403) throw new Error(`expected 403 got ${res.status}`);
  });

  // Customer cannot patch status (admin/technician only) -> 403
  await check("Customer cannot PATCH /api/bookings/:id/status -> 403", async()=>{
    const {res}=await fetchJson("/api/bookings/000000000000000000000099/status",{method:"PATCH", headers:{ "Content-Type":"application/json", Authorization: custToken }, body: JSON.stringify({status:"confirmed"})});
    if(res.status!==403) throw new Error(`expected 403 got ${res.status}`);
  });

  // Invalid status transition validation: without DB will be 503 or 404, but validation should be 400 for bad status
  await check("Invalid status value -> 400", async()=>{
    const {res}=await fetchJson("/api/bookings/000000000000000000000099/status",{method:"PATCH", headers:{ "Content-Type":"application/json", Authorization: adminToken }, body: JSON.stringify({status:"bad_status"})});
    if(res.status!==400) throw new Error(`expected 400 got ${res.status}`);
  });

  // Slots should show available true when DB not connected
  await check("Slots available flag true when DB disconnected", async()=>{
    const {body}=await fetchJson("/api/bookings/slots?date=2026-12-01");
    if(!body.data.every(s=>s.available===true)) throw new Error("not all available");
  });

  console.log(`\n=== Booking RBAC Results: ${pass} passed, ${fail} failed ===`);
  server.close(()=>process.exit(fail>0?1:0));
});

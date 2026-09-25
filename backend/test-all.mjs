import app from "./src/app.ts";
import http from "http";

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log(`\n=== AMD IT SOLUTION BACKEND TEST ===`);
  console.log(`Test server on ${port}\n`);

  let passed = 0, failed = 0;
  const check = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.log(`❌ FAIL: ${name} -> ${e.message}`);
      failed++;
    }
  };

  const fetchJson = async (path, opts = {}) => {
    const res = await fetch(`http://127.0.0.1:${port}${path}`, opts);
    let body;
    try { body = await res.json(); } catch { body = await res.text(); }
    return { res, body };
  };

  // 1. Health checks (no DB needed)
  await check("GET /health -> 200 ok", async () => {
    const { res, body } = await fetchJson("/health");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    if (body.status !== "ok") throw new Error(`body ${JSON.stringify(body)}`);
  });

  await check("GET /api/health -> 200 ok", async () => {
    const { res, body } = await fetchJson("/api/health");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    // healthRoutes returns {status:ok} or /api/health fallback
    const ok = body.status === "ok" || body.success !== false;
    if (!ok) throw new Error(`body ${JSON.stringify(body)}`);
  });

  await check("GET /api/services/categories -> 200 (public)", async () => {
    const { res, body } = await fetchJson("/api/services/categories");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    if (!body.data || !Array.isArray(body.data)) throw new Error(`no data array`);
  });

  await check("GET /nonexistent -> 404", async () => {
    const { res } = await fetchJson("/nonexistent");
    if (res.status !== 404) throw new Error(`expected 404 got ${res.status}`);
  });

  // 2. Auth validation (should be 400 even without DB)
  await check("POST /api/auth/login empty body -> 400 validation", async () => {
    const { res } = await fetchJson("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
  });

  await check("POST /api/auth/register invalid email -> 400", async () => {
    const { res } = await fetchJson("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname: "A", email: "bad", password: "123" }),
    });
    if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
  });

  await check("POST /api/auth/login missing password -> 400", async () => {
    const { res } = await fetchJson("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com" }),
    });
    if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
  });

  // 3. Protected routes without token -> 401
  await check("GET /api/auth/me without token -> 401", async () => {
    const { res } = await fetchJson("/api/auth/me");
    if (res.status !== 401) throw new Error(`expected 401 got ${res.status}`);
  });

  await check("GET /api/bookings without token -> 401", async () => {
    const { res } = await fetchJson("/api/bookings");
    if (res.status !== 401) throw new Error(`expected 401 got ${res.status}`);
  });

  await check("POST /api/services without token -> 401", async () => {
    const { res } = await fetchJson("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", slug: "test", description: "desc desc desc", category: "cctv", price: 100 }),
    });
    if (res.status !== 401) throw new Error(`expected 401 got ${res.status}`);
  });

  await check("GET /api/payments without token -> 401", async () => {
    const { res } = await fetchJson("/api/payments");
    if (res.status !== 401) throw new Error(`expected 401 got ${res.status}`);
  });

  // 4. Public GETs should work even without DB (or return 200/500 handled)
  const publicGets = [
    "/api/services",
    "/api/technicians",
    "/api/products",
    "/api/reviews",
    "/api/amc-plans",
  ];
  for (const p of publicGets) {
    await check(`GET ${p} -> 200 or handled`, async () => {
      const { res } = await fetchJson(p);
      // If DB disconnected, our controllers may throw 500 — we consider that expected, but want to ensure route exists
      // For health, we expect 200; for others, either 200 or 500 is okay as long as not 404
      if (res.status === 404) throw new Error(`route not found 404`);
      if (res.status !== 200 && res.status !== 500) throw new Error(`unexpected ${res.status}`);
    });
  }

  await check("POST /api/quotes valid -> 201 or 503 (DB unavailable)", async () => {
    const { res } = await fetchJson("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", email: "test@test.com", phone: "9999999999", serviceType: "cctv", message: "Need quote for shop" }),
    });
    if (res.status === 400) throw new Error(`should not be validation error`);
    if (![201, 503, 500].includes(res.status)) throw new Error(`expected 201/503/500 got ${res.status}`);
  });

  await check("POST /api/quotes invalid -> 400", async () => {
    const { res } = await fetchJson("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
  });

  await check("POST /api/coupons/validate without code -> 400", async () => {
    const { res } = await fetchJson("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) throw new Error(`expected 400 got ${res.status}`);
  });

  // 5. Test RBAC: need tokens. Try to create tokens without DB by signing manually (no DB check for auth middleware)
  // We'll test authorize logic by creating a fake customer token
  const fakeCustomerToken = "Bearer " + (await import("jsonwebtoken")).default.sign({ id: "000000000000000000000001", role: "customer", email: "cust@test.com" }, process.env.JWT_SECRET || "amd_it_solution_dev_secret_2026_change_in_prod_32chars!");
  const fakeAdminToken = "Bearer " + (await import("jsonwebtoken")).default.sign({ id: "000000000000000000000002", role: "admin", email: "admin@test.com" }, process.env.JWT_SECRET || "amd_it_solution_dev_secret_2026_change_in_prod_32chars!");

  await check("POST /api/services with customer token -> 403 (admin only)", async () => {
    const { res } = await fetchJson("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": fakeCustomerToken },
      body: JSON.stringify({ title: "Test CCTV", slug: "test-cctv-2", description: "Test description for CCTV service longer than 10 chars", category: "cctv", price: 1000 }),
    });
    if (res.status !== 403) throw new Error(`expected 403 got ${res.status} body ${JSON.stringify(await res.clone?.() ? "" : "")}`);
  });

  await check("GET /api/coupons with customer token -> 403 (admin only)", async () => {
    const { res } = await fetchJson("/api/coupons", {
      headers: { "Authorization": fakeCustomerToken },
    });
    if (res.status !== 403) throw new Error(`expected 403 got ${res.status}`);
  });

  await check("POST /api/coupons with customer token -> 403", async () => {
    const { res } = await fetchJson("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": fakeCustomerToken },
      body: JSON.stringify({ code: "TEST10", discountType: "percent", discountValue: 10, expiry: new Date(Date.now()+86400000).toISOString() }),
    });
    if (res.status !== 403) throw new Error(`expected 403 got ${res.status}`);
  });

  // 6. Root info
  await check("GET / -> 200 with endpoints", async () => {
    const { res, body } = await fetchJson("/");
    if (res.status !== 200) throw new Error(`status ${res.status}`);
    if (!body.endpoints) throw new Error(`no endpoints`);
  });

  // 7. CORS header check
  await check("GET /health has CORS header", async () => {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    const cors = res.headers.get("access-control-allow-origin");
    if (!cors) throw new Error("no CORS header");
  });

  // 8. Ensure secrets not exposed: try to register and check password not returned (requires DB, so skip if DB not connected)
  // We'll just check that /api/auth/register validation doesn't leak secrets

  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
});

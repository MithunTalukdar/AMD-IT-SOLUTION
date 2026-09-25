import app from "./backend/src/app.ts";
import http from "http";

const server = http.createServer(app);
server.listen(0, async () => {
  const port = server.address().port;
  console.log("Test server on", port);
  try {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    const json = await res.json();
    console.log("GET /health status:", res.status);
    console.log("GET /health body:", json);
    if (res.status === 200 && json.status === "ok") console.log("HEALTH PASS");
    else console.log("HEALTH FAIL");

    const res2 = await fetch(`http://127.0.0.1:${port}/api/health`);
    const json2 = await res2.json();
    console.log("GET /api/health status:", res2.status);
    console.log("body:", json2);

    const res3 = await fetch(`http://127.0.0.1:${port}/api/services/categories`);
    console.log("GET /api/services/categories status:", res3.status);
    const txt = await res3.text();
    console.log("body snippet:", txt.slice(0,200));

    const res4 = await fetch(`http://127.0.0.1:${port}/nonexistent`);
    console.log("GET /nonexistent status:", res4.status);
    const txt4 = await res4.text();
    console.log("404 body:", txt4.slice(0,200));

    const res5 = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    console.log("POST /api/auth/login empty body status:", res5.status);
    console.log("body:", (await res5.text()).slice(0,300));

  } catch(e){ console.error(e); }
  finally { server.close(); }
});

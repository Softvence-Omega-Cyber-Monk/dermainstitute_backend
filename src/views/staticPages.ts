export const WELCOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome | Derma Institute</title>
  <style>
    :root { --bg: #0f172a; --fg: #e2e8f0; --accent: #38bdf8; --muted: #94a3b8; --card: #111827; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; background: radial-gradient(1200px 600px at 10% 10%, #0b1225, var(--bg)), radial-gradient(800px 400px at 90% 10%, #0a142a, var(--bg)), var(--bg); color: var(--fg); min-height: 100vh; display: grid; place-items: center; overflow-x: hidden; }
    .container { text-align: center; padding: 2.5rem; max-width: 880px; width: 100%; position: relative; }
    .glow { position: absolute; inset: -20% -10% auto -10%; height: 300px; background: radial-gradient(closest-side, rgba(56,189,248,0.25), rgba(56,189,248,0) 70%); filter: blur(30px); animation: float 10s ease-in-out infinite; }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
    .title { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 800; letter-spacing: -0.02em; margin: 0.25rem 0 0.5rem; background: linear-gradient(90deg, #fff, var(--accent)); -webkit-background-clip: text; background-clip: text; color: transparent; animation: glowText 4s ease-in-out infinite; }
    @keyframes glowText { 0%,100% { text-shadow: 0 0 0 rgba(56,189,248,0.0) } 50% { text-shadow: 0 0 24px rgba(56,189,248,0.35) } }
    .subtitle { color: var(--muted); font-size: clamp(1rem, 2.6vw, 1.15rem); margin-bottom: 2rem; }
    .card { display: inline-block; padding: 1.25rem 1.5rem; border-radius: 16px; background: linear-gradient(180deg, rgba(17,24,39,0.75), rgba(17,24,39,0.6)); box-shadow: 0 0 0 1px rgba(148,163,184,0.08), 0 10px 30px rgba(2,6,23,0.6); backdrop-filter: blur(6px); }
    .pill { display: inline-flex; align-items: center; gap: 8px; padding: 0.5rem 0.85rem; border-radius: 999px; background: rgba(56,189,248,0.12); color: #e0f2fe; border: 1px solid rgba(56,189,248,0.25); font-weight: 600; text-decoration: none; transition: transform .2s ease, box-shadow .2s ease; }
    .pill:hover { transform: translateY(-2px); box-shadow: 0 10px 18px rgba(56,189,248,0.2); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.75rem; }
    .feature { padding: 1rem; border-radius: 14px; background: rgba(2,6,23,0.45); border: 1px solid rgba(148,163,184,0.1); text-align: left; transition: transform .25s ease, border-color .25s ease; }
    .feature:hover { transform: translateY(-4px); border-color: rgba(56,189,248,0.35); }
    .feature h3 { margin: 0 0 .4rem; font-size: 1.05rem; }
    .feature p { margin: 0; color: var(--muted); font-size: .95rem; line-height: 1.35rem; }
    .sparkles { position: absolute; inset: 0; pointer-events: none; }
    .dot { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: rgba(56,189,248,0.85); filter: blur(0.5px); animation: twinkle 3s infinite ease-in-out; }
    .dot:nth-child(2){ left: 12%; top: 18%; animation-delay: .3s }
    .dot:nth-child(3){ right: 8%; top: 28%; animation-delay: .8s }
    .dot:nth-child(4){ left: 20%; bottom: 12%; animation-delay: 1.4s }
    .dot:nth-child(5){ right: 16%; bottom: 16%; animation-delay: 2s }
    @keyframes twinkle { 0%,100% { opacity: .2; transform: scale(.8)} 50% { opacity: 1; transform: scale(1.1)} }
  </style>
</head>
<body>
  <div class="container">
    <div class="glow"></div>
    <div class="sparkles">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <p class="card pill">✨ Welcome to Derma Institute API</p>
    <h1 class="title">You're in the right place</h1>
    <p class="subtitle">The API is online. Explore endpoints under <strong>/api</strong> or open the interactive docs.</p>
    <div class="grid">
      <div class="feature">
        <h3>REST API</h3>
        <p>Use endpoints prefixed with <strong>/api</strong> for authentication, users, reports, SOPs and more.</p>
      </div>
      <div class="feature">
        <h3>API Docs</h3>
        <p>Interactive Swagger UI is available at <code>/api/docs</code> to try requests directly.</p>
      </div>
      <div class="feature">
        <h3>Prisma Studio</h3>
        <p>Visualize your data at <code>http://localhost:5555</code> while developing locally.</p>
      </div>
      <div class="feature">
        <h3>Security</h3>
        <p>Authenticate with Bearer tokens. Sensitive routes require appropriate roles.</p>
      </div>
    </div>
    <div style="margin-top:1.75rem;">
      <a class="pill" href="/api/docs">Open Swagger Docs ➜</a>
    </div>
  </div>
</body>
</html>`;

export const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 | Not Found</title>
  <style>
    :root { --bg: #0b1021; --fg: #e5e7eb; --accent: #fb7185; --muted: #9ca3af; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; background: radial-gradient(900px 500px at 20% -10%, #11193a, var(--bg)), radial-gradient(700px 400px at 120% 10%, #0d1530, var(--bg)); color: var(--fg); min-height: 100vh; display: grid; place-items: center; overflow: hidden; }
    .wrap { text-align: center; padding: 2rem; max-width: 760px; position: relative; }
    .halo { position: absolute; inset: auto -20% 60% -20%; height: 300px; background: radial-gradient(closest-side, rgba(251,113,133,0.24), rgba(251,113,133,0) 70%); filter: blur(26px); animation: float 8s ease-in-out infinite; }
    @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
    .code { font-weight: 900; font-size: clamp(5rem, 18vw, 12rem); letter-spacing: -0.03em; line-height: .85; margin: 0; background: linear-gradient(180deg, #fff 0%, #fecaca 60%, #fda4af 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 10px 24px rgba(251,113,133,0.25)); }
    .scan { position: relative; display: inline-block; }
    .scan::after { content: ""; position: absolute; left: -10%; right: -10%; height: 2px; background: linear-gradient(90deg, transparent, rgba(251,113,133,0.6), transparent); animation: scan 2.6s linear infinite; }
    @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
    .msg { margin-top: .25rem; color: var(--muted); font-size: 1.05rem; }
    .actions { margin-top: 1.5rem; display: flex; gap: .75rem; justify-content: center; flex-wrap: wrap; }
    .btn { padding: .7rem 1rem; border-radius: 10px; border: 1px solid rgba(148,163,184,0.25); background: rgba(17,24,39,0.55); color: #fde68a; text-decoration: none; font-weight: 600; transition: transform .2s ease, box-shadow .2s ease; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.25); }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="halo"></div>
    <div class="scan">
      <h1 class="code">404</h1>
    </div>
    <p class="msg">We couldn't find the page you're looking for. The endpoint may be moved or incorrect.</p>
    <div class="actions">
      <a class="btn" href="/">Go Home</a>
      <a class="btn" href="/api/docs">API Docs</a>
    </div>
  </div>
</body>
</html>`;

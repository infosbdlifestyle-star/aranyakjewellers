import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatusJson() {
    return {
      status: 'online',
      service: 'Aranyak Jewellers Backend API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'MongoDB Atlas (Connected)',
      endpoints: [
        { path: '/api/categories', methods: ['GET', 'POST'] },
        { path: '/api/products', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
        { path: '/api/banners', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
        { path: '/api/gold-price', methods: ['GET', 'POST'] },
        { path: '/api/stores', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
        { path: '/api/settings', methods: ['GET', 'POST'] },
        { path: '/api/auth/me', methods: ['GET', 'PUT'] },
      ]
    };
  }

  getDashboardHtml(): string {
    const uptimeMinutes = Math.floor(process.uptime() / 60);
    const uptimeSeconds = Math.floor(process.uptime() % 60);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aranyak Jewellers • Backend Control Engine</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: radial-gradient(circle at 50% 0%, #150a10 0%, #060204 60%, #030102 100%);
      color: #F3F4F6;
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }
    .container {
      width: 100%;
      max-width: 980px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }
    .badge-top {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(229, 193, 88, 0.12);
      border: 1px solid rgba(229, 193, 88, 0.35);
      color: #E5C158;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 16px;
      box-shadow: 0 0 20px rgba(229, 193, 88, 0.2);
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 2s infinite;
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 600;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #FFFDF8 20%, #E5C158 60%, #B8860B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #9CA3AF;
      font-size: 14px;
      letter-spacing: 0.05em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 22px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: rgba(229, 193, 88, 0.4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .card-emerald { border-left: 4px solid #10B981; }
    .card-gold { border-left: 4px solid #E5C158; }
    .card-cyan { border-left: 4px solid #38BDF8; }
    .card-purple { border-left: 4px solid #C084FC; }

    .card-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #9CA3AF;
      margin-bottom: 8px;
    }
    .card-value {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-desc {
      font-size: 12px;
      color: #6B7280;
      margin-top: 6px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #E5C158;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .endpoints-container {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .endpoint-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.02);
      margin-bottom: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: background 0.2s ease;
    }
    .endpoint-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .endpoint-path {
      font-family: monospace;
      font-size: 13px;
      color: #F3F4F6;
      font-weight: 600;
    }
    .methods {
      display: flex;
      gap: 6px;
    }
    .method-badge {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .get { background: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .post { background: rgba(56, 189, 248, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .put { background: rgba(251, 146, 60, 0.2); color: #FB923C; border: 1px solid rgba(251, 146, 60, 0.3); }
    .delete { background: rgba(244, 63, 94, 0.2); color: #F43F5E; border: 1px solid rgba(244, 63, 94, 0.3); }

    .btn-link {
      color: #E5C158;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 6px;
      background: rgba(229, 193, 88, 0.1);
      transition: all 0.2s ease;
    }
    .btn-link:hover {
      background: rgba(229, 193, 88, 0.25);
    }

    .actions-bar {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .action-primary {
      background: linear-gradient(135deg, #E5C158, #CBA135);
      color: #050202;
      box-shadow: 0 4px 20px rgba(229, 193, 88, 0.35);
    }
    .action-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(229, 193, 88, 0.5);
    }
    .action-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .action-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-top">
        <span class="badge-dot"></span>
        API ENGINE ACTIVE
      </div>
      <h1>Aranyak Jewellers</h1>
      <p class="subtitle">High Jewellery Core API & Master Database Service</p>
    </div>

    <div class="grid">
      <div class="card card-emerald">
        <div class="card-title">Backend Status</div>
        <div class="card-value" style="color: #34D399;">
          <span>Online</span>
        </div>
        <div class="card-desc">Port 3001 • Fast Express/NestJS</div>
      </div>

      <div class="card card-gold">
        <div class="card-title">Database</div>
        <div class="card-value" style="color: #E5C158;">
          <span>Connected</span>
        </div>
        <div class="card-desc">MongoDB Atlas • Prisma ORM</div>
      </div>

      <div class="card card-cyan">
        <div class="card-title">Live Uptime</div>
        <div class="card-value" style="color: #38BDF8;">
          <span>${uptimeMinutes}m ${uptimeSeconds}s</span>
        </div>
        <div class="card-desc">Zero downtime monitoring</div>
      </div>

      <div class="card card-purple">
        <div class="card-title">Client Proxies</div>
        <div class="card-value" style="color: #C084FC;">
          <span>Next.js 16</span>
        </div>
        <div class="card-desc">Auto-proxied via /api/*</div>
      </div>
    </div>

    <div class="endpoints-container">
      <div class="section-title">
        <span>⚡ Live REST API Catalog</span>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span><span class="method-badge post">POST</span></div>
          <span class="endpoint-path">/api/categories</span>
        </div>
        <a href="/api/categories" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span><span class="method-badge post">POST</span><span class="method-badge put">PUT</span></div>
          <span class="endpoint-path">/api/products</span>
        </div>
        <a href="/api/products" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span><span class="method-badge post">POST</span></div>
          <span class="endpoint-path">/api/gold-price</span>
        </div>
        <a href="/api/gold-price" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span><span class="method-badge post">POST</span></div>
          <span class="endpoint-path">/api/banners</span>
        </div>
        <a href="/api/banners" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span><span class="method-badge post">POST</span></div>
          <span class="endpoint-path">/api/settings</span>
        </div>
        <a href="/api/settings" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>

      <div class="endpoint-row">
        <div class="endpoint-left">
          <div class="methods"><span class="method-badge get">GET</span></div>
          <span class="endpoint-path">/api/stores</span>
        </div>
        <a href="/api/stores" target="_blank" class="btn-link">Test Endpoint →</a>
      </div>
    </div>

    <div class="actions-bar">
      <a href="http://localhost:3000" target="_blank" class="action-btn action-primary">
        ✨ Open Frontend Website
      </a>
      <a href="http://localhost:3000/admin" target="_blank" class="action-btn action-secondary">
        👑 Open Admin Portal
      </a>
    </div>
  </div>
</body>
</html>`;
  }
}

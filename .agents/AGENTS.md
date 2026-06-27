# AI Memory — Aranyak Jewellers

## Project Overview
- **Frontend**: Next.js 16 (App Router), deployed on Vercel at `https://aranyakjewellers.vercel.app`
- **Backend**: NestJS + Prisma (MongoDB), deployed on VPS at `http://117.252.16.132:3001`
- **Admin Panel**: `/admin` route on frontend, accessible to ADMIN and SUPER_ADMIN roles only

---

## Architecture

### Frontend → Backend Connection
- All `/api/*` requests from the frontend are **proxied** to the VPS backend via `next.config.ts` rewrites.
- All `/uploads/*` image URLs are also **proxied** to the VPS backend via `next.config.ts` rewrites.
- Images stored in database MUST be relative paths like `/uploads/filename.jpg` — NOT absolute URLs like `http://117.252.16.132:3001/uploads/filename.jpg` (causes browser mixed-content blocking on HTTPS).
- `NEXT_PUBLIC_API_URL` is NOT needed — frontend calls `/api/...` and Next.js proxies it.

### next.config.ts rewrites (DO NOT REMOVE)
```ts
async rewrites() {
  return [
    { source: '/api/:path*', destination: 'http://117.252.16.132:3001/api/:path*' },
    { source: '/uploads/:path*', destination: 'http://117.252.16.132:3001/uploads/:path*' },
  ];
}
```

### Image Upload Flow
1. Admin uploads image via drag-and-drop UI on `/admin/categories`, `/admin/banners`, or `/admin/products`.
2. Frontend POSTs to `/api/upload` (proxied to VPS backend).
3. Backend saves file to `/root/aranyak_uploads/` on VPS, returns `{ path: "/uploads/filename.jpg" }`.
4. Frontend stores the **relative path** `/uploads/filename.jpg` — NOT the full URL.
5. Frontend renders it as `<img src="/uploads/filename.jpg">` which Next.js proxies securely.

### Image Sizes (Admin UI guidance)
- **Category image**: 800×1200 px (Portrait), max 2MB
- **Banner image**: 1920×1080 px (Landscape), max 5MB
- **Product images**: 1000×1000 px (Square), max 5MB each

---

## CRITICAL: Frontend Fetch Rules (DO NOT BREAK)

### Rule 1 — ALL server-side page fetches MUST use `cache: 'no-store'` + `AbortController` timeout
Never use `{ next: { revalidate: N } }` in page-level fetches — this causes Vercel builds to **hang for 60+ seconds per page** if the VPS is slow or being deployed.

**Correct pattern for every page that fetches from backend:**
```ts
export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000); // 5-second hard timeout
    const res = await fetch('http://117.252.16.132:3001/api/something', {
      cache: 'no-store',
      signal: controller.signal,
    });
    return res.ok ? await res.json() : [];
  } catch {
    return []; // Always return fallback — never throw
  }
}
```

### Rule 2 — Header menu MUST have a static fallback
The Header receives `categories` as a prop from `layout.tsx`. If the backend returns empty, the Header **must fall back to the static `CATEGORIES` constant** from `@/constants/categories`. Never show a blank menu.

```ts
// In Header.tsx — always do this:
const rootCategories = categories.length > 0
  ? categories.filter(c => !c.parentId).map(cat => ({
      ...cat,
      subcategories: categories.filter(c => c.parentId === cat.id),
    }))
  : CATEGORIES; // ← static fallback from @/constants/categories
```

### Rule 3 — layout.tsx fetches backend with 5-second timeout
```ts
// src/app/layout.tsx
async function getGlobalData() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const [catRes, setRes] = await Promise.all([
      fetch('http://117.252.16.132:3001/api/categories', { cache: 'no-store', signal: controller.signal }),
      fetch('http://117.252.16.132:3001/api/settings', { cache: 'no-store', signal: controller.signal })
    ]);
    clearTimeout(timeout);
    ...
  } catch {
    return { categories: [], settings: {} }; // Fallback
  }
}
```

---

## Git Configuration & Deployment

### Git
- Local git user: `santrarony9` (`santrarony9@gmail.com`)
- Remote: `https://github.com/infosbdlifestyle-star/aranyakjewellers.git`
- `santrarony9` is a **Collaborator** on the `infosbdlifestyle-star` org repo — push works.
- Default branch: `main`
- **PowerShell note**: Use `;` not `&&` to chain commands (e.g. `git add .; git commit -m "..."; git push`)

### Frontend Deployment (Vercel)
- **Primary method**: `git push origin main` → Vercel auto-deploys from GitHub.
- **Backup method**: Run `npx vercel --prod --yes` from the `frontend/` directory.
- The `frontend/vercel.json` MUST contain `"name": "aranyakjewellers"` to target the correct project.
- The Vercel project is under team `rony-santras-projects`, project `aranyakjewellers`.
- Live URLs: `https://aranyakjewellers.vercel.app` and `https://aranyakjewellers-xi.vercel.app`

### Backend Deployment (VPS)
- **VPS IP**: `117.252.16.132`, user: `root`, SSH password: `$9T%Lk057bzu`
- **Upload persistence**: Uploaded files stored at `/root/aranyak_uploads/`, symlinked to `/root/aranyak-backend/uploads`.
- **PM2 process name**: `aranyak-backend`

**Deploy steps (always in this order):**
1. Fix/update code in `backend/`
2. Compress: `tar --exclude=node_modules --exclude=dist -czf backend.tar.gz -C backend .`
3. Run: `node deploy.js` from `scratch_deploy/` folder
4. The script uploads `backend.tar.gz` + `.env.production` to VPS, installs deps, builds, restarts PM2.

**Key files:**
- `scratch_deploy/deploy.js` — SSH deploy script (improved with `keepaliveInterval: 10000` and `readyTimeout: 30000`)
- `scratch_deploy/.env.production` — Production env vars (gitignored — keep locally)

**Current `.env.production` values:**
```
DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers"
JWT_SECRET="aranyak_secret_key_production_deploy_secure"
PORT=3001
FRONTEND_URL="https://aranyakjewellers.vercel.app,https://aranyakjewellers-xi.vercel.app"
```

**CRITICAL**: `FRONTEND_URL` controls CORS on the backend. If Vercel domain changes, update this AND redeploy backend.

---

## Admin Panel Structure

| Route | Purpose |
|---|---|
| `/admin` | Dashboard: stats, gold rate manager, quick actions |
| `/admin/products` | Add/Edit/Delete products with images |
| `/admin/categories` | Add/Edit/Delete categories with showcase images |
| `/admin/banners` | Add/Edit/Delete homepage carousel banners |
| `/admin/stores` | Add/Edit/Delete store locations |
| `/admin/settings` | Edit global site settings (ticker text, contact info, etc.) |

---

## Known Issues & Fixes (Critical History)

| # | Issue | Fix Applied |
|---|---|---|
| 1 | Dropdown menu white-on-white | Header dropdown uses `bg-[#0A0505]` dark background with white text |
| 2 | Image mixed-content error (HTTP on HTTPS) | Images stored as relative `/uploads/...`, proxied by Next.js |
| 3 | Backend build TS error | `settings.service.ts` `results` typed as `any[]` |
| 4 | CORS errors on login | `FRONTEND_URL` in `.env.production` set correctly |
| 5 | GitHub push 403 | `santrarony9` added as Collaborator — push works now |
| 6 | SSH disconnect during VPS deploy | `keepaliveInterval: 10000` + `readyTimeout: 30000` in `deploy.js` |
| 7 | Prisma db push failing | Pass `DATABASE_URL=...` as prefix in command |
| 8 | Vercel build hanging 60s/page | Changed all fetches to `cache: 'no-store'` + `AbortController` 5s timeout + `export const dynamic = 'force-dynamic'` on every page |
| 9 | Menu went blank when backend down | Header uses `CATEGORIES` static constant as fallback when backend returns empty |
| 10 | Seed.js SKU conflict | Seed is run with `|| true` — safe to ignore error if product already exists |

---

## Important Code Patterns

### API calls (frontend)
All API calls go through `src/lib/api.ts`. Use `api.methodName()` functions. Never hardcode backend URL directly in client components — use the proxy via `/api/...`.

### Auth
- JWT stored in `AuthContext`, passed as `Bearer token` header.
- Role check: `user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'`
- Admin pages must check `isLoading` before redirecting — prevents immediate logout.

### Backend Guards
- `JwtAuthGuard` — requires valid JWT
- `RolesGuard` + `@Roles('ADMIN', 'SUPER_ADMIN')` — role check

### Static Categories (always keep up to date)
File: `frontend/src/constants/categories.ts`
Contains: Gold (with 10 subcategories), Diamond (4), Silver (4), Astrological Stones (4), Costume Jewellery, Offers & Deals.
Hidden from menu: `['costume-jewellery', 'offers-deals']`

---

## Deployment Checklist

**Backend changed:**
- [ ] `tar --exclude=node_modules --exclude=dist -czf backend.tar.gz -C backend .`
- [ ] `node deploy.js` from `scratch_deploy/`
- [ ] Verify PM2 is `online` in deploy output

**Frontend changed:**
- [ ] `git add frontend/; git commit -m "..."; git push origin main`
- [ ] OR: `npx vercel --prod --yes` from `frontend/` as backup
- [ ] Confirm build output shows `ƒ (Dynamic)` — NOT `○ (Static)` (static = possible hanging risk)
- [ ] Verify at `https://aranyakjewellers.vercel.app`

**Both changed:**
- [ ] Deploy backend first, then frontend

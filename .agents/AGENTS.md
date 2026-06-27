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
- This means image URLs saved in the database MUST be relative paths like `/uploads/filename.jpg` — NOT absolute URLs like `http://117.252.16.132:3001/uploads/filename.jpg` (that causes browser mixed-content blocking on HTTPS).
- `NEXT_PUBLIC_API_URL` is NOT needed for proxied requests — the frontend simply calls `/api/...`.

### Image Upload Flow
1. Admin uploads image via drag-and-drop UI on `/admin/categories`, `/admin/banners`, or `/admin/products`.
2. Frontend POSTs to `/api/upload` (proxied to VPS backend).
3. Backend saves file to `/root/aranyak_uploads/` on VPS, returns `{ path: "/uploads/filename.jpg" }`.
4. Frontend stores the relative path `/uploads/filename.jpg` in the database — NOT the full URL.
5. When displayed, the Next.js proxy serves it from `https://aranyakjewellers.vercel.app/uploads/filename.jpg`.

### Image Sizes (Admin UI guidance)
- **Category image**: 800×1200 px (Portrait), max 2MB
- **Banner image**: 1920×1080 px (Landscape), max 5MB
- **Product images**: 1000×1000 px (Square), max 5MB each

---

## Git Configuration & Deployment

### Git
- Local git user: `santrarony9` (`santrarony9@gmail.com`)
- Remote: `https://github.com/infosbdlifestyle-star/aranyakjewellers.git`
- `santrarony9` is a **Collaborator** on the `infosbdlifestyle-star` org repo — push should work.
- Default branch: `main`

### Frontend Deployment (Vercel)
- **Primary method**: `git push origin main` → Vercel auto-deploys from GitHub.
- **Backup method**: Run `npx vercel --prod --yes` from the `frontend/` directory (deploys directly).
- The `frontend/vercel.json` MUST contain `"name": "aranyakjewellers"` to target the correct project.
- The Vercel project is under team `rony-santras-projects`, project `aranyakjewellers`.
- Live URLs: `https://aranyakjewellers.vercel.app` and `https://aranyakjewellers-xi.vercel.app`

### Backend Deployment (VPS)
- **VPS IP**: `117.252.16.132`, user: `root`, SSH password: `$9T%Lk057bzu`
- **Upload persistence**: Uploaded files stored at `/root/aranyak_uploads/`, symlinked to `/root/aranyak-backend/uploads`.
- **PM2 process name**: `aranyak-backend`

**Deploy steps:**
1. Fix/update code in `backend/`
2. Compress: `tar --exclude=node_modules --exclude=dist -czf backend.tar.gz -C backend .`
3. Run: `node deploy.js` from `scratch_deploy/` folder
4. The script uploads `backend.tar.gz` + `.env.production` to VPS, installs deps, builds, restarts PM2.

**Key files:**
- `scratch_deploy/deploy.js` — SSH deploy script (uploads tarball and restarts PM2)
- `scratch_deploy/.env.production` — Production env vars uploaded to VPS as `/root/.env.production`

**Current `.env.production` values:**
```
DATABASE_URL="mongodb://localhost:27017/aranyak_jewellers"
JWT_SECRET="aranyak_secret_key_production_deploy_secure"
PORT=3001
FRONTEND_URL="https://aranyakjewellers.vercel.app,https://aranyakjewellers-xi.vercel.app"
```

**CRITICAL**: The `FRONTEND_URL` env var controls CORS on the backend. If the Vercel domain changes, update this file AND redeploy the backend.

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

## Known Issues Fixed

1. **Dropdown menu was white-on-white** → Fixed: Header dropdown now uses `bg-[#0A0505]` (dark) with white text.
2. **Image mixed-content error** → Fixed: Images stored as relative `/uploads/...` paths, proxied by Next.js.
3. **Backend build error** → Fixed: `settings.service.ts` `results` array typed as `any[]`.
4. **CORS errors on login** → Fixed: `FRONTEND_URL` env var set correctly in `.env.production`.
5. **GitHub push 403** → RESOLVED: `santrarony9` is now a Collaborator on the repo. Push works.
6. **VPS SSH disconnect during deploy** → Fixed: Added `keepaliveInterval` and longer `readyTimeout` in `deploy.js`.
7. **Prisma db push failing** → Fixed: Commands now pass `DATABASE_URL` directly as env prefix.
8. **Admin category/banner/product pages missing** → Created: all pages under `frontend/src/app/admin/`.

---

## Important Code Patterns

### API calls (frontend)
All API calls go through `src/lib/api.ts`. Use `api.methodName()` functions. Never hardcode backend URL directly — use the proxy via `/api/...`.

### Auth
- JWT stored in `AuthContext`, passed as `Bearer token` header.
- Role check: `user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'`

### Backend Guards
- `JwtAuthGuard` — requires valid JWT
- `RolesGuard` + `@Roles('ADMIN', 'SUPER_ADMIN')` — role check

---

## Deployment Checklist (for future changes)

- [ ] Make code changes
- [ ] If backend changed: `tar --exclude=node_modules --exclude=dist -czf backend.tar.gz -C backend .`
- [ ] If backend changed: `node deploy.js` from `scratch_deploy/`
- [ ] If frontend changed: `git add frontend/; git commit -m "..."; git push origin main`
- [ ] OR: `npx vercel --prod --yes` from `frontend/` as backup
- [ ] Verify at `https://aranyakjewellers.vercel.app`

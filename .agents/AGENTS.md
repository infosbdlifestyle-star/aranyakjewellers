# AI Memory

## Git Configuration & Deployment
- The local git is configured for user `santrarony9` (`santrarony9@gmail.com`).
- The remote repository is hosted at `infosbdlifestyle-star/aranyakjewellers`.
- Currently, `git push` fails with a 403 error because `santrarony9` is denied permission to push to the `infosbdlifestyle-star` remote. 
- **Action for future pushes:** Be aware that direct pushing may fail due to this account mismatch unless the user manually handles credentials or uses a different account. Do not assume `git push origin main` will succeed automatically.
- **Vercel Deployment (Frontend):** Since GitHub pushing is currently failing due to a 403 error, deploy the frontend directly via Vercel CLI. 
  1. Go to the `frontend` directory.
  2. The `vercel.json` file MUST contain `"name": "aranyakjewellers"` so that it deploys to the correct Vercel project and domain (`aranyakjewellers.vercel.app`).
  3. Run `npx vercel --prod --yes` to deploy using the authenticated session.
- **Backend Deployment (VPS):** The backend is deployed on `117.252.16.132` (user `root`). 
  1. The correct SSH password for deployment is `$9T%Lk057bzu`.
  2. First, compress the backend folder (excluding node_modules/dist): `tar --exclude=node_modules --exclude=dist -czf backend.tar.gz -C backend .`
  3. The `scratch_deploy/deploy.js` script handles SSH upload and PM2 restarting. Ensure the script uploads `.env.production` directly (`ssh.putFile`) rather than generating it via `echo`, as `echo` can cause Prisma validation errors.
  4. The `.env.production` file MUST have `FRONTEND_URL` correctly set to the exact frontend domain(s) (e.g. `FRONTEND_URL="https://aranyakjewellers.vercel.app"`) to avoid CORS "Internal server error" issues during login or API calls. If you change the Vercel project domain, you MUST update this file and redeploy.
  5. Run `node deploy.js` from the `scratch_deploy` folder to deploy.

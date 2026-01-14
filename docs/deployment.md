# Vercel Deployment Guide - Virtual Mandi

This project is configured as a monorepo for seamless deployment of both the React frontend and Fastify backend to Vercel.

## Deployment Steps

1. **Push to GitHub**: Ensure your latest changes (including `vercel.json` and the root `package.json`) are pushed to your repository.
2. **Import to Vercel**:
   - Go to the [Vercel Dashboard](https://vercel.com/dashboard).
   - Click "Add New" -> "Project".
   - Select your `village-mandi` repository.
3. **Configure Project Settings**:
   - **Framework Preset**: Vercel should automatically detect the Root and Vite. Ensure it stays as "Other" or "Vite" if it prompts.
   - **Root Directory**: Leave as `.` (the repository root).
   - **Build Command**: `npm run build` (This is defined in the root `package.json`).
   - **Output Directory**: `web/dist`.
4. **Environment Variables**:
   Add the following variables in the Vercel project settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (Required for Prisma).
   - `NODE_ENV`: `production`.
5. **Deploy**: Click "Deploy".

## Verification

Once deployed, you can verify the setup as follows:

### 1. Backend Health Check
Access the following URL:
`https://village-mandi-naikdeepak-naikdeepaks-projects.vercel.app/api/health`

**Expected Response**:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "philosophy": "Trust & Transparency",
  "rules": { ... }
}
```

### 2. Frontend Check
Access the root URL:
`https://village-mandi-naikdeepak-naikdeepaks-projects.vercel.app/`

> [!NOTE]
> Once the production deployment is stable, the primary URL will be `https://village-mandi.vercel.app/`.

The React application should load and interact with the `/api` routes correctly through the Vercel routing configuration.

## Monorepo Structure (Zero Config)
- `api/index.ts`: The main entry point for the backend API (Fastify).
- `public/`: Contains the built React frontend assets.
- `web/`: Frontend source code.
- `server/`: Backend source code (legacy, logic moved to root for Vercel).
- `shared/`: Shared logic/constants.

## Environment Variables
Ensure you have set the `DATABASE_URL` in the Vercel dashboard for the Prisma client to work.

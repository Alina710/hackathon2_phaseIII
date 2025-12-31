# Vercel Deployment Guide

## Required Configuration

### 1. Root Directory
Set the **Root Directory** in Vercel project settings to:
```
frontend
```

### 2. Environment Variables
Add these environment variables in Vercel Dashboard → Project Settings → Environment Variables:

**For Production:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

**For Development/Preview:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

## Important Notes

### Backend Deployment Required
The frontend expects a backend API. You need to deploy the FastAPI backend separately:

**Recommended Backend Hosting:**
- **Render.com** (Python/FastAPI support)
- **Railway.app** (Easy deployment)
- **Fly.io** (Global deployment)

### Backend Deployment Steps:
1. Deploy backend to a hosting service
2. Get the backend URL (e.g., `https://your-app.onrender.com`)
3. Update `NEXT_PUBLIC_API_URL` in Vercel with: `https://your-app.onrender.com/api/v1`

### Database Setup
Replace SQLite with PostgreSQL for production:
- Render.com provides free PostgreSQL databases
- Railway also offers PostgreSQL
- Update backend connection string accordingly

## Troubleshooting

### Build Hangs or Times Out
If the build appears to hang after "Next.js now collects completely anonymous telemetry":
1. Check if environment variables are set in Vercel
2. The build might be waiting for a required env var
3. Add `NEXT_PUBLIC_API_URL` even if backend isn't deployed yet (use a placeholder)

### Module Not Found Errors
All required files should now be in the repository, including:
- `frontend/src/lib/api.ts`
- `frontend/src/lib/constants.ts`
- `frontend/src/lib/types.ts`
- `frontend/src/lib/auth.ts`
- `frontend/src/lib/utils.ts`

## Quick Deploy Checklist

- [ ] Set Root Directory to `frontend` in Vercel
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable
- [ ] Deploy backend separately
- [ ] Update environment variable with actual backend URL
- [ ] Test the deployed application

## Support

If you encounter issues:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure backend is deployed and accessible
4. Check CORS settings on backend allow your Vercel domain

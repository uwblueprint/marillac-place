# Railway Deployment Configuration

This document outlines the proper configuration for deploying the Marillac Place application to Railway.

## Environment Variables

Railway must have the following environment variables configured:

### Required Production Variables

```
NODE_ENV=production
DATABASE_URL=<Railway-provided PostgreSQL URL>
FRONTEND_URL=<production frontend URL>
JWT_SECRET=<secure secret>
ADMIN_STAFF_PASSWORD=<secure password>
RELIEF_STAFF_PASSWORD=<secure password>
```

**Important:** Setting `NODE_ENV=production` is critical. This ensures:
- Only system badges are seeded (no mock data)
- Database is not reset on deployment
- Production-appropriate behavior throughout the application

## Database Setup

### Initial Deployment

On first deployment to Railway, the database needs to be initialized with the schema and seeded with system badges:

1. Railway will automatically run `prismaInitAndRun` via the Dockerfile
2. This will:
   - Apply database schema via `prisma db push` (production) or `prisma migrate deploy` (dev)
   - Generate Prisma client
   - Sync Snaplet seed configuration
   - Run the seed script (which checks `NODE_ENV` to determine what to seed)

### Subsequent Deployments

The seed script (`backend/seed/seed-snaplet.ts`) is idempotent in production mode:
- It checks if badges already exist before seeding
- If badges exist, it skips seeding
- This prevents duplicate data on redeployment

## Seed Script Behavior

### Production Mode (`NODE_ENV=production`)
- Seeds only system badges from `backend/seed/prodData.ts`
- Does NOT reset the database
- Does NOT seed mock data
- Only inserts badges if none exist (idempotent)

### Development Mode (`NODE_ENV=development`)
- Resets the entire database
- Seeds system badges
- Seeds mock data (participants, tasks, announcements, etc.)

## Manual Database Seeding

If you need to manually seed the database on Railway:

### Seed Production Data Only
```bash
yarn seed:prod
```

### Seed Development Data (⚠️ WARNING: This resets the database)
```bash
yarn seed:dev
```

## Troubleshooting

### Issue: Mock data appearing in production
**Cause:** `NODE_ENV` is not set to `production` in Railway environment variables

**Solution:**
1. Go to Railway project settings
2. Add environment variable: `NODE_ENV=production`
3. Redeploy the service

### Issue: Database schema not updating
**Cause:** Production uses `prisma db push` instead of migrations

**Solution:**
- For production, `prisma db push` is used (as configured in `prismaInitAndRun`)
- For complex schema changes, consider using migrations in production as well
- Modify the `prismaInitAndRun` script if needed

### Issue: Seed script running on every deployment
**Cause:** This is expected behavior, but the script is idempotent in production

**Verification:**
- Check logs for "Badges already exist, skipping seeding"
- This confirms the idempotent behavior is working correctly

## Architecture Notes

### Why Different Scripts for Dev and Prod?

- **Local Development (Docker)**: Uses `prismaInitAndRun` which includes seeding
  - Runs via `yarn prismaInitAndRun` (Dockerfile ENTRYPOINT)
  - Uses `NODE_ENV=development` (or whatever is set in `.env`)

- **Railway Production**: Uses `start` script
  - Railway's default is to run `yarn start` for Node.js apps
  - `start` script does NOT include seeding (correct for restarts)
  - Initial seeding happens via `prismaInitAndRun` on first deployment

### Dockerfile vs Railway

The Dockerfile is used by both:
- **Docker Compose (local)**: Uses `ENTRYPOINT ["yarn", "prismaInitAndRun"]`
- **Railway (production)**: Also uses the same Dockerfile

Railway respects the ENTRYPOINT, so both environments run `prismaInitAndRun` on container start.

## Best Practices

1. **Never commit production credentials** to `.env` files
2. **Set NODE_ENV=production** in Railway environment variables
3. **Test seed scripts locally** before deploying:
   ```bash
   # Test production seeding locally
   NODE_ENV=production yarn seed:prod
   ```
4. **Monitor Railway logs** on deployment to verify seeding behavior
5. **Keep system badges in sync** between `prodData.ts` and production database

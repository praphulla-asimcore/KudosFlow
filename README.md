# KudosFlow — Audit Document Automation Platform

Phase 1 of KudosFlow, a web-based audit document automation platform for Malaysian audit and assurance firms.

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v4 (email/password)
- **Charts:** Recharts

## Setup

1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Copy `.env.example` to `.env` and fill in the values
4. Push database schema: `npx prisma db push`
5. Seed the database: `npm run prisma db seed`
6. Run development server: `npm run dev`

## Deployment

### Automatic Deployment with GitHub Actions

This project is configured for automatic deployment to Vercel using GitHub Actions.

#### Setup Instructions:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Import Project" and connect your GitHub repository
   - Configure the project settings (build command: `npm run build`, output directory: `.next`)

2. **Get Vercel Tokens:**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token with appropriate permissions
   - Copy the token value

3. **Configure GitHub Secrets:**
   In your GitHub repository, go to Settings → Secrets and variables → Actions and add these secrets:

   ```
   VERCEL_TOKEN=your_vercel_token_here
   VERCEL_ORG_ID=your_vercel_org_id
   VERCEL_PROJECT_ID=your_vercel_project_id
   DATABASE_URL=your_production_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   RESEND_API_KEY=your_resend_api_key
   ```

4. **How to find Vercel IDs:**
   - `VERCEL_ORG_ID`: Run `vercel org ls` in terminal or find in Vercel dashboard URL
   - `VERCEL_PROJECT_ID`: Run `vercel project ls` or find in Vercel project settings

#### Deployment Behavior:
- **Push to main branch**: Deploys to production
- **Pull requests**: Creates preview deployments
- **Automatic**: No manual intervention needed after setup

### Manual Deployment
If you prefer manual deployment, use:
```bash
npm run build
vercel --prod
```

## Phase 1 Features
- **Login Screen:** Secure email/password authentication with role detection
- **Dashboard:** Stats cards, recent activity feed, quick actions, top clients chart
- **Clients:** Full CRUD with search, filter, archive functionality
- **Engagements:** Create and manage per-client audit engagements
- **Audit Trail:** Immutable log of all system actions
- **Role-Based Access:** Admin, Partner, Senior, Staff roles with menu visibility control

## User Roles
- **Admin:** Full system access
- **Partner:** Firm-wide data access, limited admin features
- **Senior:** Assigned clients and engagements
- **Staff:** Limited access to assigned work only

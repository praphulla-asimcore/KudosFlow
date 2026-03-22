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

# JobHunter Serverless Setup Guide

This guide will help you set up the JobHunter application using **Next.js API Routes** for a fully serverless deployment on Vercel.

## 🏗️ Architecture Overview

- **Frontend**: Next.js with TypeScript, Redux Toolkit, React Hook Form + Zod
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: NeonDB (PostgreSQL) with Drizzle ORM
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel (fully serverless)

## Prerequisites

- Node.js 18+ installed
- A NeonDB account (free tier available)
- A Vercel account (for deployment)
- Optional: Google OAuth and GitHub OAuth apps

## 1. Install Dependencies

```bash
npm install
```

## 2. Database Setup (NeonDB)

### Create a NeonDB Database

1. Go to [NeonDB](https://neon.tech) and create a free account
2. Create a new project/database
3. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### Set Environment Variables

Copy the example environment file:
```bash
copy env.example .env.local
```

Update `.env.local` with your values:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional - leave empty to disable)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Database Configuration (NeonDB)
DATABASE_URL=your-neondb-connection-string-here
```

## 3. Database Migration

```bash
# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Optional: Open Drizzle Studio to view your database
npm run db:studio
```

## 4. Run the Application Locally

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 5. API Routes Structure

The backend is now built into Next.js using API Routes:

```
/app/api/
├── auth/[...nextauth]/route.ts    # NextAuth configuration
├── jobs/route.ts                   # GET / POST all jobs
├── jobs/[id]/route.ts             # PATCH / DELETE specific job
└── jobs/export/route.ts           # GET CSV export
```

## 6. OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

## 7. Production Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to Vercel
vercel

# Set environment variables on Vercel
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add DATABASE_URL
# Add OAuth variables if using them
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
```

### Update Environment Variables for Production

After deployment, update your environment variables:

**Production URLs:**
- `NEXTAUTH_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`)

**OAuth Redirect URIs (if using):**
- Google: `https://your-app.vercel.app/api/auth/callback/google`
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`

## 8. Features

Your JobHunter application includes:

- ✅ **Serverless architecture** - No separate backend needed
- ✅ **User authentication** (email/password, Google, GitHub)
- ✅ **Job application tracking** with full CRUD operations
- ✅ **Advanced filtering and search**
- ✅ **Data export to CSV**
- ✅ **Responsive design with dark mode**
- ✅ **Real-time updates with React Query**
- ✅ **Form validation with Zod**
- ✅ **Type-safe database operations with Drizzle ORM**

## 9. Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database studio
```

## 10. Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure your DATABASE_URL is correct
2. **NextAuth errors**: Check that NEXTAUTH_SECRET and NEXTAUTH_URL are set correctly
3. **OAuth not working**: Verify redirect URIs match exactly in OAuth app settings
4. **Build errors**: Ensure all required environment variables are set

### Database Migration Issues

If you need to reset the database:
```bash
# Drop and recreate tables (be careful with production data)
npm run db:generate
npm run db:migrate
```

## 11. Next Steps

- Set up monitoring and logging
- Add email notifications for follow-ups
- Implement data backup strategy
- Add more social login providers
- Enhance analytics and reporting
- Add mobile app support

## 🎯 Why This Architecture?

✅ **Vercel-native** - Optimized for Vercel's serverless platform
✅ **No separate backend** - Everything in one Next.js app
✅ **Scalable** - Automatic scaling with serverless functions
✅ **Cost-effective** - Pay only for what you use
✅ **Rapid development** - Full-stack in one codebase
✅ **Type-safe** - End-to-end TypeScript

Your job hunting tracker is now ready to help you land that dream job! 🚀 
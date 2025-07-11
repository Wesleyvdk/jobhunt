# JobHunter Setup Guide

This guide will help you set up the JobHunter application locally and deploy it to production.

## Prerequisites

- Node.js 18+ installed
- A NeonDB account (free tier available)
- A Vercel account (for deployment)
- Optional: Google OAuth and GitHub OAuth apps (for social login)

## 1. Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd jobhunter

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## 2. Database Setup (NeonDB)

### Create a NeonDB Database

1. Go to [NeonDB](https://neon.tech) and create a free account
2. Create a new project/database
3. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### Set Environment Variables

The environment files have been created for you:
- Frontend: `.env.local`
- Backend: `backend/.env`

### Frontend Environment Variables (`.env.local`)

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (optional - leave empty to disable)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend Environment Variables (`backend/.env`)

```env
# Database Configuration
DATABASE_URL=your-neondb-connection-string-here

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here-change-this-in-production
```

## 3. Database Migration

```bash
cd backend

# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Optional: Open Drizzle Studio to view your database
npm run db:studio
```

## 4. Run the Application Locally

### Start the Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```

The backend will be available at http://localhost:3001

### Start the Frontend (Terminal 2)
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## 5. OAuth Setup (Optional)

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

## 6. Production Deployment

### Deploy Backend to Vercel

The backend is configured to work as serverless functions on Vercel.

```bash
cd backend

# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to Vercel
vercel

# Set environment variables on Vercel
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
```

### Deploy Frontend to Vercel

```bash
# From the root directory
vercel

# Set environment variables on Vercel
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_API_URL
# Add OAuth variables if using them
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
```

### Update Environment Variables for Production

After deployment, update your environment variables:

**Frontend Production URLs:**
- `NEXTAUTH_URL`: Your frontend Vercel URL (e.g., `https://your-app.vercel.app`)
- `NEXT_PUBLIC_API_URL`: Your backend Vercel URL (e.g., `https://your-api.vercel.app/api`)

**Backend Production URLs:**
- `FRONTEND_URL`: Your frontend Vercel URL (e.g., `https://your-app.vercel.app`)

**OAuth Redirect URIs (if using):**
- Google: `https://your-app.vercel.app/api/auth/callback/google`
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`

## 7. Features

Your JobHunter application includes:

- ✅ User authentication (email/password, Google, GitHub)
- ✅ Job application tracking
- ✅ Advanced filtering and search
- ✅ Data export to CSV
- ✅ Responsive design with dark mode
- ✅ Real-time updates
- ✅ Form validation

## 8. Troubleshooting

### Common Issues

1. **Database connection errors**: Ensure your DATABASE_URL is correct and the database is accessible
2. **CORS errors**: Check that FRONTEND_URL in backend matches your frontend URL
3. **OAuth not working**: Verify redirect URIs match exactly in OAuth app settings
4. **Build errors**: Ensure all environment variables are set correctly

### Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter

# Backend
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open database studio
```

## 9. Next Steps

- Set up monitoring and logging
- Add email notifications for follow-ups
- Implement data backup strategy
- Add more social login providers
- Enhance analytics and reporting
- Add mobile app support

For support or questions, please refer to the documentation or create an issue in the repository. 
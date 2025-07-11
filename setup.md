# Quick Setup Checklist ✅

## Step 1: Environment Variables Setup

I've already created the environment files for you. Now you just need to fill in a few values:

### Frontend (`.env.local`) - Required Changes:
```bash
# Replace this with a secure secret (I generated one for you):
NEXTAUTH_SECRET=efdd34663a9c7052b5480d9fdda0b873374c1a1338f31a8d6efff073e6174808

# Leave OAuth variables empty for now if you don't want social login:
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

### Backend (`backend/.env`) - Required Changes:
```bash
# You need to get this from NeonDB:
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Generate a JWT secret:
JWT_SECRET=your-jwt-secret-here-make-it-long-and-random
```

## Step 2: Get Your NeonDB Connection String

1. Go to https://neon.tech
2. Sign up for free
3. Create a new project
4. Go to "Connection Details" 
5. Copy the connection string that looks like:
   `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`
6. Paste it in `backend/.env` as the `DATABASE_URL`

## Step 3: Test the Setup

```bash
# Terminal 1 - Start backend
cd backend
npm run start:dev

# Terminal 2 - Start frontend  
npm run dev
```

Then visit http://localhost:3000

## Step 4: Deploy to Vercel (Optional)

Both frontend and backend are ready for Vercel deployment:

```bash
# Deploy backend
cd backend
vercel

# Deploy frontend
cd ..
vercel
```

## That's it! 🎉

Your job tracking application should now be running with:
- ✅ Modern React/Next.js frontend
- ✅ NestJS serverless backend  
- ✅ PostgreSQL database (NeonDB)
- ✅ User authentication
- ✅ Job application tracking
- ✅ CSV export
- ✅ Responsive design
- ✅ Ready for production deployment

## Need Help?

Check the full `SETUP_GUIDE.md` for detailed instructions, or if you run into any issues, the most common problems are:

1. **Database connection**: Make sure your DATABASE_URL is correct
2. **CORS errors**: Check that your environment URLs match
3. **Build errors**: Ensure all required environment variables are set 
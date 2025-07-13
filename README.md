# JobHunter - Serverless Job Application Tracker

A modern, fully serverless job hunting tracker built with Next.js, TypeScript, and NeonDB. Deploy directly to Vercel with zero backend infrastructure needed.

## 🚀 Features

- **📊 Job Application Tracking** - Track companies, positions, dates, and status
- **🔍 Advanced Filtering** - Search, filter by status, and date ranges
- **📈 Analytics Dashboard** - View application statistics and progress
- **📤 CSV Export** - Export your data for backup or analysis
- **🔐 Authentication** - Email/password, Google, and GitHub OAuth
- **🌙 Dark Mode** - Beautiful responsive design with theme switching
- **⚡ Real-time Updates** - Instant UI updates with React Query
- **✅ Form Validation** - Type-safe forms with Zod validation

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Redux Toolkit, React Hook Form
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: NeonDB (PostgreSQL) with Drizzle ORM
- **Authentication**: NextAuth.js with multiple providers
- **Deployment**: Vercel (fully serverless)

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo>
   cd jobhunter
   npm install
   ```

2. **Set up environment variables**
   ```bash
   copy env.example .env.local
   # Edit .env.local with your values
   ```

3. **Set up database**
   ```bash
   # Get your NeonDB connection string
   npm run db:generate
   npm run db:migrate
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   ```bash
   vercel
   ```

## 📁 Project Structure

```
/app
├── api/                    # Serverless API routes
│   ├── auth/[...nextauth]/ # NextAuth configuration
│   ├── jobs/route.ts       # GET / POST all jobs
│   ├── jobs/[id]/route.ts  # PATCH / DELETE specific job
│   └── jobs/export/route.ts # CSV export
├── dashboard/              # Dashboard pages
└── auth/                   # Authentication pages

/src
├── components/             # React components
├── lib/
│   ├── database/          # Database schema and connection
│   ├── slices/            # Redux store slices
│   ├── hooks/             # Custom React hooks
│   └── validations/       # Zod schemas
```

## 🛠️ Development

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

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE_SERVERLESS.md) - Complete setup instructions
- [API Documentation](API_DOCS.md) - API routes reference
- [Deployment Guide](DEPLOYMENT.md) - Vercel deployment guide

## 🎯 Why Serverless?

✅ **Zero Infrastructure** - No servers to manage  
✅ **Automatic Scaling** - Handles traffic spikes effortlessly  
✅ **Cost Effective** - Pay only for what you use  
✅ **Vercel Native** - Optimized for Vercel's platform  
✅ **Type Safe** - End-to-end TypeScript  
✅ **Rapid Development** - Full-stack in one codebase  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js, TypeScript, and Vercel

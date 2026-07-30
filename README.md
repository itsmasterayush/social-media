# 🚀 SocialPulse - Production-Ready Full-Stack Social Media Platform

SocialPulse is a modern, high-performance, full-stack social media application built from scratch with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, and **Mongoose**.

---

## 📌 Project Overview

SocialPulse enables users to register, log in securely via JWT HttpOnly cookies, create engaging post articles, read and filter posts in real-time, update/delete their own posts with modal confirmation, give single likes per post, track post views per session, view a live **Top Posts Leaderboard** ranked by total engagement score (`Score = Likes + Views`), and monitor overall post statistics on their personal **Dashboard**.

Designed specifically for **Vercel Serverless Deployment** with zero-config database connection pooling and optimized cold starts.

---

## ✨ Features

- 🔐 **Secure JWT Authentication**: HttpOnly cookies with bcrypt password hashing and strong password validation.
- ✍️ **Post CRUD**: Complete Create, Read, Update, and Delete actions with strict author authorization.
- ❤️ **Real-Time Likes**: Users can like posts once with instant client-side UI updates.
- 👁️ **Session-Based View Tracking**: Increments post view count once per user session.
- 🏆 **Engagement Leaderboard (`/leaderboard`)**: Real-time ranking of top posts based on `Score = Likes + Views` descending.
- 📊 **User Dashboard (`/dashboard`)**: Personal overview of Total Posts, Total Likes Received, Total Views Received, and recent posts.
- 🔍 **Real-time Search**: Instant filtering across Post Titles, Content, and Author names.
- 📑 **Pagination**: Server-assisted pagination with 10 items per page limit.
- 🎨 **Modern Dark Mode UI**: Vibrant HSL color palette, smooth glassmorphism header, micro-animations, loading skeletons, toast notifications, and responsive navigation.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, React Hook Form, Zod, Axios
- **Backend**: Next.js 15 App Router API Routes (Route Handlers)
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JWT (`jsonwebtoken`) in `HttpOnly` Cookies & `bcryptjs`
- **Validation**: Shared client & server Zod schemas
- **Deployment**: Vercel

---

## 📂 Scalable Architecture & Folder Structure

```text
social-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page
│   │   └── register/page.tsx        # Registration page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST /api/auth/login
│   │   │   ├── logout/route.ts      # POST /api/auth/logout
│   │   │   ├── me/route.ts          # GET /api/auth/me
│   │   │   └── register/route.ts    # POST /api/auth/register
│   │   ├── dashboard/route.ts       # GET /api/dashboard
│   │   ├── leaderboard/route.ts     # GET /api/leaderboard
│   │   └── posts/
│   │       ├── [id]/
│   │       │   ├── like/route.ts    # POST /api/posts/:id/like
│   │       │   ├── route.ts         # GET, PUT, DELETE /api/posts/:id
│   │       │   └── view/route.ts    # POST /api/posts/:id/view
│   │       └── route.ts             # GET, POST /api/posts
│   ├── dashboard/page.tsx           # Personal user dashboard
│   ├── leaderboard/page.tsx         # Engagement leaderboard
│   ├── posts/
│   │   ├── [id]/
│   │   │   ├── edit/page.tsx        # Edit post page
│   │   │   └── page.tsx             # Post details page
│   │   └── create/page.tsx          # Create post page
│   ├── globals.css                  # Global Tailwind styles & dark mode tokens
│   ├── layout.tsx                   # Root layout with Navbar & Providers
│   └── page.tsx                     # Main Feed page
├── components/
│   ├── ui/                          # Reusable UI components (Button, Input, Card, Modal, Badge, Skeleton, Toast)
│   ├── DashboardStats.tsx           # Dashboard stats grid & list
│   ├── DeleteModal.tsx              # Confirmation modal for post deletion
│   ├── LeaderboardTable.tsx         # Leaderboard table with rank badges
│   ├── Navbar.tsx                   # Responsive navigation bar
│   ├── Pagination.tsx               # Feed pagination control
│   ├── PostCard.tsx                 # Post feed card component
│   ├── PostForm.tsx                 # Form component for post create/edit
│   ├── Providers.tsx                # Context providers (Auth, Toast)
│   ├── SearchBar.tsx                # Real-time search bar
│   └── ThemeToggle.tsx              # Light / Dark mode toggle button
├── controllers/                     # Business logic controllers
│   ├── authController.ts
│   ├── dashboardController.ts
│   ├── leaderboardController.ts
│   └── postController.ts
├── hooks/                           # Custom React hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── useTheme.ts
├── lib/                             # Shared libraries
│   ├── api.ts                       # Axios client configuration
│   ├── db.ts                        # Mongoose connection with caching
│   ├── jwt.ts                       # JWT signing and verification
│   └── utils.ts                     # Utility helpers (cn, formatDate, truncateText)
├── middleware/
│   └── authMiddleware.ts            # Route handler auth verification middleware
├── models/                          # Mongoose database models
│   ├── Post.ts
│   └── User.ts
├── services/                        # Service layer functions
│   ├── authService.ts
│   ├── dashboardService.ts
│   ├── leaderboardService.ts
│   └── postService.ts
├── types/                           # TypeScript interfaces
│   ├── auth.ts
│   ├── index.ts
│   └── post.ts
├── utils/                           # Response and validation helpers
│   ├── apiResponse.ts
│   └── validators.ts
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Define the following environment variables:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/social_media_db?retryWrites=true&w=majority

# Secret key for JWT signing
JWT_SECRET=super_secret_jwt_key_change_in_production_32chars

# Base API URL
NEXT_PUBLIC_API_URL=/api

# Node Environment
NODE_ENV=development
```

---

## 💻 Local Development & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create a new user account & set HttpOnly cookie
- `POST /api/auth/login` - Authenticate user & set HttpOnly cookie
- `POST /api/auth/logout` - Clear token cookie & log out
- `GET /api/auth/me` - Retrieve current authenticated user profile

### Posts
- `GET /api/posts?page=1&limit=10&search=` - Fetch paginated & filtered posts
- `GET /api/posts/:id` - Fetch single post by ID
- `POST /api/posts` - Create post (Auth required)
- `PUT /api/posts/:id` - Update post (Author required)
- `DELETE /api/posts/:id` - Delete post (Author required)
- `POST /api/posts/:id/like` - Like post (Auth required, 1 like per user)
- `POST /api/posts/:id/view` - Increment post view count (1 view per session)

### Leaderboard & Dashboard
- `GET /api/leaderboard` - Get top posts ranked by `Score = Likes + Views`
- `GET /api/dashboard` - Get total user posts, total likes received, total views, and recent posts (Auth required)

---

## 🚀 Step-by-Step Vercel Deployment Guide

1. **Push Code to GitHub / Git Provider**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** > **Project**.
   - Select your GitHub repository.

3. **Configure Environment Variables**:
   In Vercel Project Settings > **Environment Variables**, add:
   - `MONGODB_URI`: Your production MongoDB Atlas URI
   - `JWT_SECRET`: A secure random secret string
   - `NEXT_PUBLIC_API_URL`: `/api`
   - `NODE_ENV`: `production`

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically build the Next.js App Router application and deploy API routes as serverless functions.

---

## 📋 Final Feature & Verification Checklist

| Category | Feature | Status |
|---|---|---|
| **Authentication** | Registration with name, email, password, confirm password | ✅ Verified |
| **Authentication** | Login with JWT issued in HttpOnly cookie | ✅ Verified |
| **Authentication** | Logout clearing token cookie & session persistence | ✅ Verified |
| **Post CRUD** | Create Post with Zod title & content validation | ✅ Verified |
| **Post CRUD** | Read Posts Feed sorted newest first (10 per page) | ✅ Verified |
| **Post CRUD** | Real-time Search by title, content, or author | ✅ Verified |
| **Post CRUD** | Update Post restricted to author only | ✅ Verified |
| **Post CRUD** | Delete Post with confirmation modal (author only) | ✅ Verified |
| **Engagements** | Like Post once per logged-in user with instant UI update | ✅ Verified |
| **Engagements** | Track Post Views once per user session | ✅ Verified |
| **Analytics** | Top Posts Leaderboard ranked by `Score = Likes + Views` | ✅ Verified |
| **Analytics** | User Dashboard with total posts, likes, views & recent posts | ✅ Verified |
| **UI / UX** | Responsive Design, Dark Mode, Toast System, Loading Skeletons | ✅ Verified |

---

## 🔮 Future Improvements

- 💬 Comment threads on posts
- 🔔 Real-time notifications via WebSockets
- 🖼️ User avatar uploads with Cloudinary / S3 integration

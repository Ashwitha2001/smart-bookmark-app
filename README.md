# Smart Bookmark App

Smart Bookmark App is a fullstack bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**.  
It allows users to securely store bookmarks, view them in real-time, and manage them privately.  


## Features

- **Google OAuth Authentication**: Login with Google only (no passwords).  
- **Private Bookmarks**: Each user sees only their own bookmarks.  
- **CRUD Operations**: Add, view, and delete bookmarks.  
- **Real-time Sync**: Changes appear instantly across multiple tabs.  
- **Deployed on Vercel**: Accessible from any browser.  


## Tech Stack & Architecture Decisions

- **Next.js (App Router)**: Modern routing and server/client components.  
- **Supabase**: Backend-as-a-service for authentication, database, and real-time updates.  
- **Tailwind CSS**: Quick, responsive styling.  
- **Row Level Security (RLS)**: Ensures bookmarks are private per user using `auth.uid() = user_id`.  
- **Real-time Subscriptions**: Implemented via `supabase.channel().on('postgres_changes', …)` for instant multi-tab updates.  


## Problems Faced & Solutions

1. **Google OAuth redirect issues**  
   - Solved by carefully following Supabase and Google Cloud OAuth setup.  

2. **TypeScript state errors**  
   - Fixed by passing correct arguments to `setState` functions.  

3. **Row Level Security configuration**  
   - Learned RLS policies (`SELECT`, `INSERT`, `DELETE`) using `auth.uid() = user_id`.  

4. **Real-time multi-tab sync**  
   - Implemented using Supabase Realtime channels, automatically updating UI on insert/delete events.  


## Why These Approaches

- **Supabase + Next.js**: Minimal backend code, production-ready, secure, and fast development.  
- **RLS + JWT**: Database-level security ensures privacy, no trust on frontend.  
- **Real-time subscriptions**: Best user experience without page refresh.  


## Deployment

- **Live Vercel URL**: [https://smart-bookmark-app.vercel.app](https://smart-bookmark-app.vercel.app)  
- **GitHub Repository**: [https://github.com/Ashwitha2001/smart-bookmark-app](https://github.com/Ashwitha2001/smart-bookmark-app)  


## Usage

1. Open the app in your browser.  
2. Login with Google.  
3. Add bookmarks with a title and URL.  
4. Delete bookmarks you no longer need.  
5. Open multiple tabs to see real-time updates.  
6. Each Google account sees only their own bookmarks.  


# 🚀 Quick Deployment Guide

## Option 1: Railway (Recommended - Easiest)

Railway deploys both frontend and backend from your docker-compose.yml!

### Steps:
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/what-should-i-eat-now.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub Repo"
   - Select your repo
   - Railway auto-detects docker-compose.yml
   - Wait ~3 mins for deployment
   - Get your public URL! 🎉

**Cost**: Free tier includes $5/month credits (enough for small apps)

---

## Option 2: Vercel + Render (More Steps, More Free)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set Root Directory: `frontend-v1`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com`
5. Deploy!

### Backend → Render
1. Go to [render.com](https://render.com)  
2. New → Web Service
3. Connect your repo
4. Settings:
   - Root Directory: `backend`
   - Runtime: Docker
   - Free Instance Type
5. Deploy!

---

## Option 3: Netlify (Frontend Only Demo)

For a quick frontend-only demo (uses fallback data when backend unavailable):

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `frontend-v1/dist` folder after running:
   ```bash
   cd frontend-v1
   npm run build
   ```

---

## After Deployment

Share your URL with friends! 🎉
- Railway: `https://your-app.up.railway.app`
- Vercel: `https://your-app.vercel.app`
- Render: `https://your-app.onrender.com`


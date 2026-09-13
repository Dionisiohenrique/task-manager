# TaskFlow - Full-Stack Task Manager

A production-ready full-stack Task Manager application built with **Angular (standalone, Signals, reactive UI, Dark Mode)** and **C# ASP.NET Core Web API (.NET 10 with EF Core & SQLite persistence)**.

---

## Free Cloud Deployment (100% Free, No Credit Card Required)

### Recommended: Single Service on Render.com

You can host both the frontend and backend together for **$0/month** on [Render.com](https://render.com) using our pre-configured unified `Dockerfile`.

#### Step 1: Push Your Code to GitHub
Open a terminal in `task-manager`:
```bash
git init
git add .
git commit -m "Initial commit: TaskFlow full stack app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

#### Step 2: Deploy on Render
1. Sign up for a free account at [render.com](https://render.com).
2. Click **New +** and choose **Web Service**.
3. Select your GitHub repository.
4. Render will automatically detect the settings:
   - **Name**: `taskflow` (or any name you like)
   - **Region**: Closest to you (e.g., Frankfurt, Ohio, Oregon)
   - **Environment**: **Docker** (it will use the root `Dockerfile`)
   - **Instance Type**: **Free**
5. Click **Deploy Web Service**.
6. Render will automatically:
   - Install dependencies and build the Angular production assets.
   - Embed the frontend into the .NET API `wwwroot`.
   - Start the .NET runtime with SQLite persistence and provide a free `https://<your-app>.onrender.com` URL.

*Note on Free Tier*: Free Web Services on Render spin down after 15 minutes of inactivity and take ~30 seconds to wake up on the first visit.

---

### Alternative Free Hosting Options

| Platform | What It Hosts | Cost | Highlights |
| :--- | :--- | :--- | :--- |
| **[Render.com](https://render.com)** | Full Stack (Unified Docker) | **$0** | Easiest setup, 1 service for both UI & API, free SSL |
| **[Koyeb.com](https://koyeb.com)** | Full Stack (Unified Docker) | **$0** | Free Eco micro instance, fast deployment |
| **[Vercel](https://vercel.com) + Render** | Angular on Vercel, API on Render | **$0** | Frontend never sleeps on Vercel's global CDN |
| **[Fly.io](https://fly.io)** | Full Stack (Docker) | **Free trial / Hobby** | Edge hosting, requires card verification |

---

## Local Deployment with Docker

```bash
docker compose up -d --build
```
- **Web App**: [http://localhost](http://localhost) (port 80)
- **API**: [http://localhost:5000/api/tasks](http://localhost:5000/api/tasks)

---

## Local Development (Without Docker)

1. **Backend**:
   ```powershell
   cd backend/TaskManager.Api
   dotnet run
   ```
2. **Frontend**:
   ```powershell
   cd frontend/task-manager-ui
   npm start
   ```
   Navigate to `http://localhost:4200`.

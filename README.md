---
# 🧠 AI‑Powered CV Builder

Create, edit, share, and download stunning CVs with **real‑time preview, multi‑user collaboration, AI‑powered suggestions, and ATS optimization**—all in one place.

🚀 **Live Demo:** [resumebuilder-frontend-i6nn.vercel.app](https://resumebuilder-frontend-i6nn.vercel.app/)
📂 **Frontend Repo:** [DEEN-42/resumebuilder-frontend](https://github.com/DEEN-42/resumebuilder-frontend)
🗄️ **Backend Repo:** [DEEN-42/ResumeBuilder-backend](https://github.com/DEEN-42/ResumeBuilder-backend)
---

## ✨ Features

| Category                      | Highlights                                                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 🎨 **Template‑Based Editor**  | Pick from **4 clean layouts** and customize instantly with a left‑panel form + right‑panel live preview.                                     |
| 🔄 **Drag & Drop Layout**     | **Freely reorder sections** (e.g., Experience, Education, Skills) to structure your CV your way.                                             |
| 🤝 **Scalable Collaboration** | Share a resume link, see **who’s online**, and co‑edit in real time. **Powered by Socket.IO & Redis** for stability across multiple servers. |
| 🧠 **AI Suggestions**         | Powered by the **Gemini API**: section‑wise tips to strengthen wording, skills, and achievements.                                            |
| 📊 **ATS Score**              | One‑click check that grades your CV’s recruiter/ATS friendliness and lists strengths & improvement areas.                                    |
| 📬 **Email Invites**          | Nodemailer sends collaboration invites + notifications.                                                                                      |
| 🔐 **Secure Auth**            | Email/password (bcrypt + JWT access & refresh tokens) **and** Google OAuth login.                                                            |
| 📥 **PDF Export**             | Download the polished resume as a high‑quality PDF.                                                                                          |
| 🗂 **Dashboard**               | View, rename, duplicate, or delete all owned / shared resumes.                                                                               |

---

## 🛠️ Tech Stack

| Layer          | Tech                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| **Frontend**   | React • Vite • Tailwind CSS • React‑Hot‑Toast                                |
| **Realtime**   | Socket.IO • **Redis**                                                        |
| **Backend**    | Node.js • Express.js                                                         |
| **Database**   | MongoDB + Mongoose                                                           |
| **AI / ATS**   | Google Gemini API (AI suggestions) + custom ATS scoring logic                |
| **Auth**       | bcrypt (hashing) • JWT (access/refresh) • Google OAuth 2.0                   |
| **Email**      | Nodemailer                                                                   |
| **Deployment** | Vercel (frontend) • Render / Fly.io / Railway _(choose your host)_ (backend) |

---

## 📦 Local Installation

> **Tip:** Clone _both_ repos into a single folder (e.g., `resume‑builder/`) so relative paths in the examples below work out of the box.

### 1\. Clone Repositories

```bash
git clone https://github.com/DEEN-42/resumebuilder-frontend.git
git clone https://github.com/DEEN-42/ResumeBuilder-backend.git
```

### 2\. Install Dependencies

#### Frontend

```bash
cd resumebuilder-frontend
npm install
```

#### Backend

```bash
cd ResumeBuilder-backend
npm install
```

### 3\. Configure Environment Variables

Create the following `.env` files.

#### `ResumeBuilder-backend/.env`

```env
PORT=3030

# Database configuration
DB_USERNAME=yourdbname
DB_PASSWORD=yourdbpassword
DB_CLUSTER_URL=yourdburl

# Redis configuration for scaling WebSockets
REDIS_URL=redis://your-redis-host:6379

# JWT secret key
JWT_SECRET=xxxxxxxxxxxxxxxxxxxx

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=xxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxx

# Gemini API key
GOOGLE_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# Google OAuth credentials
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Nodemailer credentials
EMAIL_USER=xxxxxxxxxxxxxxxxxxx
EMAIL_PASS=xxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL
FRONTEND_URL=https://resumebuilder-frontend-i6nn.vercel.app
```

#### `resumebuilder-frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4\. Run in Development Mode

```bash
# In one terminal: Start the backend
cd ResumeBuilder-backend
npm run dev
```

```bash
# In another terminal: Start the frontend
cd resumebuilder-frontend
npm run dev
```

After downloading change the backend url to your specific url as wanted in apiConfig.js present in constants directory in frontend
Your site should now be available at **[http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)** (or your default Vite port).

---

## 🤖 How AI Suggestions Work

1.  Click **“AI Suggest”** on any section.
2.  The current text is sent to the Gemini API.
3.  Gemini responds with concise, impact‑oriented rewrites + keyword suggestions.
4.  Accept, reject, or tweak before saving.

---

## 🛡️ Security Notes

- **Passwords:** salted & hashed with bcrypt (12 rounds).
- **Tokens:** short‑lived access token + rotating refresh token stored in secure HTTP‑only cookies.
- **HTTPS:** strongly recommended in production (Vercel provides automatic TLS).

---

## 🚀 Deployment

| Layer         | Service               | Branch → URL                                                                                                 |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Frontend**  | Vercel                | `main` → [https://resumebuilder-frontend-i6nn.vercel.app/](https://resumebuilder-frontend-i6nn.vercel.app/)  |
| **Backend**   | Render/Fly/Railway\*  | `main` → _add your Render URL (or other host) when deployed_                                                 |

\* Replace with the actual host you pick—the environment variables above are structured to be friendly with hosts like Render.

---

## 📜 License

Released under the **MIT License**.

> Feel free to fork, star, and contribute—PRs are welcome\!

---

## 🙌 Acknowledgements

- **Google Gemini API** – natural‑language magic ✨
- **Socket.IO & Redis** – effortless, scalable real‑time sync
- **Vercel** – zero‑config frontend hosting
- **MongoDB Atlas** – scalable document DB

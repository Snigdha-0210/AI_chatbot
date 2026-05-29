# 🎓 CampusCopilot AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.6-orange?logo=firebase)](https://firebase.google.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-green?logo=openai)](https://openai.com/)

A production-ready AI SaaS platform designed for college students, featuring a Career Chatbot, an ATS Resume Scanner, and an interactive Dashboard. Built using **Next.js 14**, **Firebase**, **OpenAI API**, and **Tailwind CSS**.

---

## 🚀 Features

- **Google Sign-In**: Firebase Authentication integrated with user profile synchronization in Firestore.
- **Interactive Dashboard**: Displays latest ATS scores, AI chat interaction counts, and recent user activity.
- **AI Career Coach Chat**: ChatGPT-style persistent chat interface with full history, responsive sidebar, and custom routes (`/chat/[id]`).
- **ATS Resume Scanner**: PDF parser backend that checks resumes, highlights missing keywords, assesses strengths and weaknesses, and logs scan history.
- **Resume Bullet Optimizer**: AI-driven tool to rewrite weak resume bullet points into strong, results-focused, and ATS-optimized statements.
- **Career & Skill Roadmaps**: Generates personalized learning paths with skills, project suggestions, and a structured roadmap/timeline.
- **Interview Preparation Guide**: Creates customized technical and behavioral interview practice questions for target roles.
- **Robust Security**: Built-in rules for Firestore (`firestore.rules`) and Firebase Storage (`storage.rules`) to guarantee user-scoped data privacy.
- **Modern UX**: Predefined skeleton loaders, toast notifications, responsive design, and empty states.
- **Protected Routes**: Middleware routing security for pages like `/dashboard`, `/chat`, `/chat/[id]`, `/ats`, `/resume-tools`, `/roadmap`, and `/interview-prep`.

---

## 📦 Project Structure

```
app/
  api/chat/          # POST - career coach logic & chat history database log
  api/ats/           # POST - PDF parser and AI ATS evaluator
  api/users/ensure/  # POST - creates/syncs Firestore user records on login
  (app)/
    dashboard/       # Dashboard dashboard interface
    chat/            # Main chat page & history navigator
    ats/             # ATS Resume Scanner interface
    interview-prep/  # Interview preparation question helper
    resume-tools/    # Resume bullet rewriter & optimizer
    roadmap/         # Skill roadmap builder
  login/             # Google Authentication landing route
  page.tsx           # Main marketing/landing page (fully styled)
components/          # Shared components (Sidebar, Chat, ATS, Dashboard, Tools)
lib/
  firebase.ts        # Client Firebase initialization (auth, firestore, storage)
  openai.ts          # Server-side OpenAI configurations
utils/               # Server-side Firebase Auth helpers, PDF parser, and API clients
types/               # Shared TypeScript schemas and interfaces
```

---

## 🛠️ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Snigdha-0210/AI_chatbot.git
cd AI_chatbot
npm install
```

### 2. Environment Variables Setup
Copy the example environment file to `.env.local`:
```bash
cp .env.local.example .env.local
```

Fill in the following variables:

| Variable | Description / Source |
|:---|:---|
| `OPENAI_API_KEY` | [OpenAI API Keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project Settings → Web App Config |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Console → Service Accounts → Generate Private Key (parsed as a single line) |

### 3. Firebase Configuration
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Google Sign-In** under **Authentication → Sign-in method**.
3. Create a **Firestore Database** and a **Storage Bucket**.
4. Deploy the rules and indexes locally using Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
   *Alternatively, copy and paste the rules from `firestore.rules`, `firestore.indexes.json`, and `storage.rules` directly into the Firebase Web Console.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔌 API Reference

### AI Chat Orchestrator
* **Route**: `POST /api/chat`
* **Headers**: `Authorization: Bearer <Firebase ID token>`
* **Payload**:
  ```json
  {
    "message": "Hello, how can I improve my resume for a Software Engineering role?",
    "chatId": "optional-chat-id-to-resume",
    "history": []
  }
  ```

### ATS Resume Scanner
* **Route**: `POST /api/ats`
* **Headers**: `Authorization: Bearer <Firebase ID token>`
* **Payload**: `Multipart/form-data` with key `file` (containing the PDF resume)
* **Response**:
  ```json
  {
    "score": 85,
    "missingKeywords": ["Docker", "CI/CD"],
    "strengths": ["Strong TypeScript background", "React projects"],
    "weaknesses": ["Lack of cloud experience"],
    "suggestions": ["Add Firebase deploy instructions or AWS experience"],
    "resumeId": "generated-firestore-resume-id"
  }
  ```

---

## 🗄️ Database Schema (Firestore)

* **`users`**: `{ id, name, email, createdAt, updatedAt }`
* **`chats`**: `{ userId, title, messages: [ { role, content, timestamp } ], createdAt, updatedAt }`
* **`resumes`**: `{ userId, score, feedback: { missingKeywords, strengths, weaknesses, suggestions }, fileName, storagePath, createdAt }`

---

## 🚀 Deployment

### Deploy on Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Configure all environment variables matching your `.env.local`.
3. Put the raw service account JSON string as-is into `FIREBASE_SERVICE_ACCOUNT_JSON`.
4. Click **Deploy**. Vercel will build the Next.js app automatically.
5. **Authorized Domains**: Add your production Vercel URL (e.g., `your-app.vercel.app`) in the Firebase Authentication console under authorized domains.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## ✍️ Author
* **Snigdha Gorai**
  * GitHub: [@Snigdha-0210](https://github.com/Snigdha-0210)
  * Email: [snigdha.24bce7185@vitapstudent.ac.in](mailto:snigdha.24bce7185@vitapstudent.ac.in)

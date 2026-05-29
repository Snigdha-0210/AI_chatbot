# CampusCopilot AI

Production-ready AI SaaS for college students: career chatbot, ATS resume scanner, and dashboard. Built with **Next.js 14**, **Firebase**, **OpenAI**, and **Tailwind CSS**.

## Features

- **Google Sign-In** (Firebase Auth) with user profiles in Firestore
- **Dashboard** — latest ATS score, chat count, recent activity
- **AI Chat** — persistent history, sidebar, `/chat/[id]` routes
- **ATS Scanner** — upload + scan history, view past results
- **Security** — Firestore + Storage rules (user-scoped data)
- **UX** — toasts, skeletons, empty states
- **Protected routes** — `/dashboard`, `/chat`, `/chat/[id]`, `/ats`

## Quick start

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|----------|-----------------|
| `OPENAI_API_KEY` | [OpenAI API keys](https://platform.openai.com/api-keys) |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console → Project settings → Your apps |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Console → Project settings → Service accounts → Generate key (paste JSON on one line) |

### 3. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. **Authentication** → Sign-in method → Enable **Google**.
3. **Firestore** → Create database.
4. **Storage** → Get started.
5. Deploy rules and indexes:

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

   Or paste `firestore.rules`, `firestore.indexes.json`, and `storage.rules` in the Firebase console.

6. Add your app as a **Web** app and copy config into `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  api/chat/          POST — career coach + save chat
  api/ats/           POST — PDF scan + save resume
  api/users/ensure/  POST — sync user on login
  dashboard/         Protected dashboard
  chat/              ChatGPT-style chat
  ats/               Resume scanner
  login/             Google sign-in
  page.tsx           Landing page
components/          UI (Sidebar, Chat, ATS, Dashboard)
lib/
  firebase.ts        Client Firebase (auth, firestore, storage)
  openai.ts          OpenAI helpers
utils/               Server auth, PDF, Firestore, API client
types/               Shared TypeScript types
```

## API routes

### `POST /api/chat`

```http
Authorization: Bearer <Firebase ID token>
Content-Type: application/json

{ "message": "...", "chatId": "optional", "history": [] }
```

### `POST /api/ats`

```http
Authorization: Bearer <Firebase ID token>
Content-Type: multipart/form-data

file: <PDF>
```

Response: `{ score, missingKeywords, strengths, weaknesses, suggestions, resumeId }`

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all variables from `.env.local` in **Settings → Environment Variables**.
4. For `FIREBASE_SERVICE_ACCOUNT_JSON`, paste the full service account JSON as a single line.
5. Deploy. Vercel runs `npm run build` automatically.

**Authorized domains:** In Firebase Auth → Settings → Authorized domains, add your Vercel domain (e.g. `your-app.vercel.app`).

## Firestore collections

| Collection | Fields |
|------------|--------|
| `users` | `id`, `name`, `email`, `createdAt`, `updatedAt` |
| `chats` | `userId`, `title`, `messages[]`, `createdAt`, `updatedAt` |
| `resumes` | `userId`, `score`, `feedback`, `fileName`, `storagePath`, `createdAt` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Notes

- Never commit `.env.local` or service account keys.
- Resume writes from the API use the Admin SDK; client reads require Firestore rules + composite indexes.
- Landing page has **no fake testimonials** — only product features and CTAs.

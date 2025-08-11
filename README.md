# Next Calendar (Next.js + Tailwind + Prisma)

A minimal calendar app scaffold with:
- Next.js (App Router)
- Tailwind CSS
- Prisma (Postgres) schema
- Add / Edit / Delete events API
- Browser reminders (simple)
- Theme toggle (light/dark)

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run dev:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

This is a starter scaffold — drag & drop, web-push, and production-ready reminders are left as next steps.

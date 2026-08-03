<p align="center">
  <img src="public/icon.svg" width="120" alt="Thesis Management Logo" />
</p>

<h1 align="center">بوابة الرسائل — Thesis Management System</h1>

<p align="center">
  A graduate studies platform for managing <strong>academic theses</strong>, supervision, faculty promotions & notifications.
  <br />
  Arabic (RTL) interface · Admin + Doctor dashboards · Prisma + Neon PostgreSQL.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-v5-3178c6?logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" />
  <img alt="NextAuth" src="https://img.shields.io/badge/NextAuth-4-000000?logo=auth0&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-radix--ui-000000?logo=shadcnui&logoColor=white" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Routes](#routes)
- [API Routes](#api-routes)
- [Security](#security)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

**بوابة الرسائل** ("Theses Gateway" / Graduate Studies System) is a full-stack Arabic (RTL) platform that digitizes graduate studies workflows for a faculty:

- **Admins** manage theses, faculty doctors, external examiners, supervisions and promotions, create doctor accounts (with temp passwords), bulk-import doctors & theses from Excel, and broadcast notifications to everyone.
- **Doctors** browse the digital thesis library with full supervision details, view thesis pages, read broadcast notifications, and manage their profile & contact info.

Built with **Next.js 16 (App Router)** + **Prisma** on **Neon PostgreSQL**, secured by **NextAuth** credentials (login by doctor code) and protected with role-based middleware.

---

## Features

### Admin Dashboard 🛡️
- **Dashboard** — live stats (total theses, master's vs PhD counts, doctors, faculty, external examiners, recent theses)
- **Thesis management** — create / track theses with type (`ماجستير` / `دكتوراه`), status workflow (`قيد التجهيز` → `قيد المناقشة` → `مجازة`), defense date, department & notes
- **Doctor accounts** — create / import doctors, auto-generated **temp passwords** shown & copied in the table
- **Faculty doctors** — manage faculty members and their supervision assignments
- **External examiners** — manage external committees (university, academic title, specialty)
- **Promotions** — track academic promotions (old title → new title + date)
- **Broadcast** — send, edit & delete notifications delivered to all doctors

### Doctor Dashboard 🎓
- **Digital library** — browse all theses with supervisors (internal + external examiners)
- **Thesis details** — dedicated page per thesis
- **Notifications** — read broadcast announcements (read/unread tracking)
- **Profile & contact** — manage profile info and a contact page

### Data Entry & UX ✨
- **Excel bulk import** for doctors (`User Id / Dr Name / Password` columns) and theses, with progress + result feedback
- **Animated UI** — Framer Motion transitions, shine buttons, gradient cards
- **Dark mode** — light/dark theme via `next-themes`, fully RTL Arabic interface

---

## Architecture

```
                        ┌──────────────────────────────────────────┐
 Browser (Arabic RTL) ─►│  Next.js 16 (App Router)                │
                        │  ├── (admin) /admin-dashboard/*          │
                        │  ├── (doctor) /doctor-dashboard/*        │
                        │  ├── (auth) /login · /api/auth           │
                        │  └── server actions (mutations)          │
                        └───────────────┬──────────────────────────┘
                                        │ Prisma (PrismaClient)
                                        ▼
                                  PostgreSQL (Neon)
                                        │
                              ┌─────────┴──────────┐
                              ▼                    ▼
                      Excel imports (xlsx)    NextAuth (bcrypt)
```

### Security model
- **NextAuth credentials** — login with `doctorCode` + `password` (bcrypt hashed, 10 rounds)
- **`middleware.ts`** — guards `/admin-dashboard` (ADMIN only) and `/doctor-dashboard` (DOCTOR only)
- **Server actions** — all mutations run server-side with session checks

---

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Framework    | Next.js 16 (App Router), React 19, TypeScript           |
| Styling      | Tailwind CSS v4 + shadcn/ui (Radix UI, lucide icons)    |
| Database     | PostgreSQL + Prisma 6 (`@prisma/adapter-neon`)          |
| Auth         | NextAuth 4 (credentials), bcrypt                        |
| Forms        | React Hook Form + Zod                                   |
| Charts       | Recharts                                               |
| Imports      | xlsx (Excel bulk import)                               |
| Animations   | Framer Motion                                          |
| Toasts       | sonner                                                 |
| Theming      | next-themes                                            |

---

## Project Structure

```text
app/
├── (admin)/admin-dashboard/
│   ├── page.tsx                   # Stats dashboard
│   ├── theses/                    # Thesis management + upload
│   ├── doctors/                   # Doctor accounts + temp passwords
│   ├── faculty-doctors/           # Faculty doctors & supervisions
│   ├── promotions/                # Academic promotions
│   ├── externals/                 # External examiners
│   └── broadcast/                 # Notification broadcasting
├── (doctor)/doctor-dashboard/
│   ├── page.tsx                   # Digital thesis library
│   ├── theses/                    # My theses list
│   ├── thesis/[id]/page.tsx       # Thesis details
│   ├── notifications/             # Broadcast notifications
│   ├── profile/                   # Profile settings
│   └── contact/                   # Contact page
├── (auth)/login/page.tsx          # Login (doctor code + password)
├── api/
│   ├── auth/[...nextauth]/route.ts # NextAuth handler
│   └── create-admin/route.ts       # Admin bootstrap endpoint
├── actions/excel-import.ts         # Excel import server action
├── layout.tsx / globals.css        # Root layout & global styles

components/                        # Reusable components (shadcn/ui + custom)
components/ui/                     # Radix UI primitives
lib/prisma.ts                      # Prisma client singleton
prisma/
├── schema.prisma                  # Data model
├── seed.ts                        # Seeds admin account
└── migrations/                    # SQL migrations
middleware.ts                      # Role-based route protection
```

---

## Data Model

> Full definition in `prisma/schema.prisma` (PostgreSQL).

### Enums

| Enum | Values |
|---|---|
| `Role` | `ADMIN` · `DOCTOR` |
| `ThesisType` | `MASTER` · `PHD` |
| `ThesisStatus` | `PENDING` (قيد التجهيز) · `IN_PROGRESS` (قيد المناقشة) · `APPROVED` (مجازة) |

### Models

| Model | Purpose |
|---|---|
| `User` | Auth account — `doctorCode` (unique), role, academic title, hashed password + temp password, avatar |
| `Thesis` | Academic thesis — title, student name, type, status, registration & defense dates, department, research type, notes |
| `FacultyDoctor` | Faculty member available for supervision & promotions |
| `ExternalExaminer` | External committee member (university, academic title, specialty) |
| `Supervision` | Links a thesis to a supervisor (faculty doctor or external examiner) + supervision role |
| `Promotion` | Faculty promotion record (old → new title, date) |
| `Notification` | Broadcast message (title, message, type, read flag) |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (or Bun)
- **PostgreSQL** (local or hosted — e.g. Neon, Supabase, RDS)

### Installation

```bash
# 1. Clone & install
git clone https://github.com/ahmed404mo/managementMessages.git
cd managementMessages
npm install

# 2. Configure environment (see below) — copy .env.example to .env.local

# 3. Generate Prisma client & apply migrations
npx prisma generate
npx prisma migrate dev

# 4. Seed the admin account
npm run seed
```

Default seeded account:

| Role | Code | Password |
|---|---|---|
| Admin | `admin` | `admin123` |

> ⚠️ Change the password immediately after the first login.

---

## Environment Variables

| Variable           | Description                                     |
|--------------------|-------------------------------------------------|
| `DATABASE_URL`     | PostgreSQL connection string (Prisma/Neon)      |
| `NEXTAUTH_URL`     | Public app URL (e.g. `http://localhost:3000`)   |
| `NEXTAUTH_SECRET`  | NextAuth signing secret (generate a strong one) |

> ⚠️ Never commit real secrets. `.gitignore` already excludes `.env*` files.

---

## Running the App

```bash
# Development
npm run dev          # → http://localhost:3000

# Production
npm run build
npm start

# Lint
npm run lint
```

---

## Routes

### Admin (`/admin-dashboard`)

| Route | Description |
|---|---|
| `/admin-dashboard` | Stats dashboard |
| `/admin-dashboard/theses` | Thesis management + Excel upload |
| `/admin-dashboard/doctors` | Doctor accounts (temp passwords) |
| `/admin-dashboard/faculty-doctors` | Faculty doctors & supervisions |
| `/admin-dashboard/promotions` | Academic promotions |
| `/admin-dashboard/externals` | External examiners |
| `/admin-dashboard/broadcast` | Broadcast notifications |

### Doctor (`/doctor-dashboard`)

| Route | Description |
|---|---|
| `/doctor-dashboard` | Digital thesis library |
| `/doctor-dashboard/theses` | My theses |
| `/doctor-dashboard/thesis/[id]` | Thesis details |
| `/doctor-dashboard/notifications` | Broadcast notifications |
| `/doctor-dashboard/profile` | Profile settings |
| `/doctor-dashboard/contact` | Contact page |

### Auth

| Route | Description |
|---|---|
| `/login` | Login page (doctor code + password) |

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | `GET/POST` | NextAuth authentication (credentials) |
| `/api/create-admin` | `GET` | Bootstraps the admin account (`admin@system.com` / `admin123`) |

---

## Security

- **bcrypt** hashed passwords (10 rounds) + temp-password workflow for imported doctors
- **Role-based middleware** — `/admin-dashboard` requires `ADMIN`, `/doctor-dashboard` requires `DOCTOR`
- **Server actions** — mutations run server-side; no secrets in the client bundle
- **Environment variables** for all sensitive configuration

---

## Deployment

The project is ready for **Vercel**:

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new) (auto-detects Next.js).
2. Set `DATABASE_URL`, `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in the dashboard.
3. Point `DATABASE_URL` at a hosted PostgreSQL (Neon) and run `npx prisma migrate deploy` before the first deploy.

---

## License

All rights reserved. DR. Mohamed Atta

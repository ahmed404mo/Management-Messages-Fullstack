# Thesis Management System — بوابة الرسائل

A graduate studies management platform for tracking academic theses, faculty supervision, promotions, and notifications. Built with Next.js (App Router), Prisma, and NextAuth, featuring a fully Arabic RTL interface for both administrators and faculty doctors.

## Features

- **Role-Based Authentication**: Secure login via NextAuth credentials using the doctor code + password (`ADMIN` / `DOCTOR` roles)
- **Admin Dashboard**:
  - Manage theses (master's & PhD) with statuses (Pending / In Progress / Approved)
  - Manage doctors, faculty doctors, and external examiners
  - Assign supervisors to theses (internal faculty + external examiners)
  - Track faculty promotions (old title → new title with dates)
  - Broadcast notifications to all users with read tracking
- **Doctor Dashboard**:
  - Browse the digital library of theses with supervisor details
  - View thesis details by ID
  - Receive and read broadcast notifications
  - Manage profile and contact information
- **Excel Imports**: Bulk import doctors/theses from `.xlsx` files
- **Real-time Notifications**: WebSocket (`ws`) support for instant updates
- **Dark Mode**: Responsive mobile-friendly UI with dark mode support

## Tech Stack

- **Frontend**: React 19, Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui (Radix UI) components
- **Database**: PostgreSQL via Prisma 6 (Neon serverless adapter)
- **Authentication**: NextAuth 4 (credentials), bcrypt-hashed passwords + temp passwords
- **Forms & Validation**: React Hook Form + Zod
- **Charts**: Recharts
- **Animations**: Framer Motion
- **File Parsing**: xlsx (Excel imports)
- **Real-time**: WebSocket (`ws`)
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── (admin)/admin-dashboard/     # Admin routes
│   │   ├── theses/                  # Thesis management
│   │   ├── doctors/                 # Doctor accounts
│   │   ├── faculty-doctors/         # Faculty doctors & supervisions
│   │   ├── promotions/              # Faculty promotions
│   │   ├── externals/               # External examiners
│   │   └── broadcast/               # Notification broadcasting
│   ├── (auth)/login/                # Authentication page
│   ├── (doctor)/doctor-dashboard/   # Doctor routes
│   │   ├── theses/                  # Digital theses library
│   │   ├── thesis/[id]/             # Thesis details
│   │   ├── notifications/           # Broadcast notifications
│   │   ├── profile/                 # Profile settings
│   │   └── contact/                 # Contact info
│   ├── api/                         # API routes
│   ├── actions/                     # Server actions (Excel import)
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/                      # Reusable UI components
│   └── ui/                          # shadcn/Radix UI components
├── lib/                            # Prisma client & utilities
├── prisma/                         # Prisma schema, migrations & seed
├── public/                         # Static assets
└── middleware.ts                   # Route protection (role-based)
```

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- npm / yarn / pnpm
- A PostgreSQL database (local or Neon serverless)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables — create `.env.local`:
```env
# Database (Neon PostgreSQL recommended)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-strong-secret
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database (creates the admin account):
```bash
npm run seed
```

Default seeded account:

| Role | Code | Password |
|---|---|---|
| Admin | `admin` | `admin123` |

> ⚠️ Change the password immediately after the first login.

## Running the Project

### Development
```bash
npm run dev
```
The app runs at `http://localhost:3000`.

### Production
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

## Routes

### Admin (`/admin-dashboard`)
- `/admin-dashboard` — Dashboard with stats (theses, doctors, supervisors, master/PhD counts)
- `/admin-dashboard/theses` — Thesis management
- `/admin-dashboard/doctors` — Doctor accounts
- `/admin-dashboard/faculty-doctors` — Faculty doctors & supervision assignments
- `/admin-dashboard/promotions` — Faculty promotions
- `/admin-dashboard/externals` — External examiners
- `/admin-dashboard/broadcast` — Send & manage broadcast notifications

### Doctor (`/doctor-dashboard`)
- `/doctor-dashboard` — Digital thesis library
- `/doctor-dashboard/theses` — My theses
- `/doctor-dashboard/thesis/[id]` — Thesis details
- `/doctor-dashboard/notifications` — Notifications
- `/doctor-dashboard/profile` — Profile settings
- `/doctor-dashboard/contact` — Contact information

### Auth
- `/login` — Login page (doctor code + password)

## API Routes

- `POST /api/auth/[...nextauth]` — NextAuth authentication
- `GET /api/create-admin` — Creates/resets the admin account (`admin@system.com` / `admin123`)

## Database (Prisma Models)

| Model | Purpose |
|---|---|
| `User` | System users (`ADMIN` / `DOCTOR`) with doctor code, academic title, temp password |
| `Thesis` | Academic theses (Master/PhD) with status, defense date, department & notes |
| `FacultyDoctor` | Faculty doctors participating in supervision |
| `ExternalExaminer` | External examiners (university, academic title, specialty) |
| `Supervision` | Links theses to supervisors (faculty doctor or external examiner + role) |
| `Promotion` | Faculty promotion history (old/new title + date) |
| `Notification` | Broadcast notifications (title, message, type, read flag) |

### Enums
- `Role`: `ADMIN`, `DOCTOR`
- `ThesisType`: `MASTER`, `PHD`
- `ThesisStatus`: `PENDING` (قيد التجهيز), `IN_PROGRESS` (قيد المناقشة), `APPROVED` (مجازة)

### Prisma Commands
- Create migration: `npx prisma migrate dev --name <name>`
- Database UI: `npx prisma studio`
- Check status: `npx prisma migrate status`
- Reset: `npx prisma migrate reset`

## Security

- Passwords hashed with `bcrypt` (10 rounds), with temporary-password support
- Role-based route protection via NextAuth middleware (`/admin-dashboard` requires `ADMIN`, `/doctor-dashboard` requires `DOCTOR`)
- Server-side authorization on all mutations (server actions)
- Environment variables used for all sensitive config (no hardcoded secrets)

## Deployment

Deployable on Vercel. Set the environment variables in your hosting provider and run migrations against your production database. For Neon PostgreSQL, the app ships with the `@neondatabase/serverless` adapter.

## License

All rights reserved. DR. Mohamed Atta

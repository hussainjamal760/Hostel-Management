<div align="center">

# 🏨 Hostelite HMS

### A Production-Grade Hostel Management System

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://hostel-management-frontend-ten.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-≥20.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Hostelite HMS** is a full-stack, multi-tenant hostel management platform built with the **MERN stack** and **TypeScript**. It streamlines every aspect of hostel operations—from room allocation and student management to expense tracking and complaint resolution—through role-based dashboards for **Admins**, **Owners**, **Managers**, and **Students**.

[**🚀 Live Demo**](https://hostel-management-frontend-ten.vercel.app/) · [**📖 API Docs**](#-api-documentation) · [**🛠️ Setup Guide**](#-getting-started)

</div>

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Role-Based Architecture](#-role-based-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with **access + refresh token** strategy
- Email verification flow for new user registration
- Role-based access control (RBAC) with granular permissions
- Rate limiting and request throttling via `express-rate-limit`
- Security headers with `helmet`
- Password hashing with `bcrypt`
- Input validation using `Zod` schemas across client and server

### 🏠 Hostel & Room Management
- Multi-hostel support — owners can manage multiple properties
- Floor-wise room configuration with customizable room types
- Bed allocation and occupancy tracking
- Room availability search for students

### 👥 Student Management
- Student registration and profile management
- Room assignment and check-in/check-out workflows
- Invoice generation and payment tracking
- Complaint submission and resolution tracking

### 💰 Financial Management
- Expense creation, categorization, and approval workflows
- Owner approval pipeline for manager-submitted expenses
- Payment tracking with invoice history
- PDF report generation using `jsPDF`

### 📊 Analytics & Reporting
- Interactive dashboard with real-time statistics per role
- Charts and data visualizations via `Chart.js` and `Recharts`
- Downloadable PDF reports for financial data

### 🔔 Notifications
- In-app notification system
- Email notifications via `Nodemailer`
- Role-targeted notifications (e.g., owners notified on expense creation)

### 📝 Complaints System
- Students can file complaints with descriptions
- Managers can view, respond to, and resolve complaints
- Owners and admins have oversight across all hostels

### 🗺️ Map Integration
- Interactive hostel location mapping with `Leaflet`
- Students can discover nearby hostels

---

## 🏗 Role-Based Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     ADMIN (Super Admin)                   │
│  Platform oversight · Owner approvals · Global reports    │
├──────────────────────────────────────────────────────────┤
│                     OWNER (Hostel Owner)                  │
│  Multi-hostel management · Manager creation · Expenses    │
├──────────────────────────────────────────────────────────┤
│                     MANAGER (Operations)                  │
│  Daily ops · Room config · Student mgmt · Payments        │
├──────────────────────────────────────────────────────────┤
│                     STUDENT (Resident)                    │
│  Room booking · Complaint filing · Invoice viewing        │
└──────────────────────────────────────────────────────────┘
```

| Role | Dashboard Capabilities |
|------|----------------------|
| **Admin** | Owner request approvals, platform-wide user management, hostel oversight, global complaints, payment reports |
| **Owner** | Hostel creation, manager assignment, expense approvals, student/complaints oversight, financial reports, settings |
| **Manager** | Room creation & configuration, student check-in/out, expense submission, payment collection, complaint handling, reports |
| **Student** | Room discovery & booking, profile management, complaint filing, invoice & payment history |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router, SSR, and file-based routing |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **React Hook Form + Zod** | Form handling with schema validation |
| **Framer Motion** | Animations and transitions |
| **Chart.js / Recharts** | Data visualizations |
| **Leaflet** | Interactive maps |
| **jsPDF** | Client-side PDF generation |
| **Lucide React / React Icons** | Icon libraries |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **TypeScript** | Type safety |
| **MongoDB Atlas + Mongoose** | Database and ODM |
| **JWT** | Authentication (access + refresh tokens) |
| **Zod** | Request validation |
| **Cloudinary** | Image and file storage |
| **Nodemailer** | Email service |
| **Winston** | Structured logging |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **Multer** | File upload handling |
| **node-cron** | Scheduled tasks |
| **Vitest** | Unit and integration testing |

### Shared Packages (Monorepo)
| Package | Purpose |
|---------|---------|
| `@hostelite/shared-types` | TypeScript interfaces shared across apps |
| `@hostelite/shared-constants` | Roles, enums, status codes |
| `@hostelite/shared-validators` | Zod validation schemas reused on client and server |

---

## 📁 Project Structure

```
hostelite/
│
├── apps/
│   ├── backend/                    # Express + TypeScript REST API
│   │   └── src/
│   │       ├── config/             # Database, env, and service configs
│   │       ├── middlewares/        # Auth, RBAC, rate limiting, validation, error handling
│   │       ├── modules/            # Feature modules (see below)
│   │       │   ├── admin/          # Platform administration
│   │       │   ├── auth/           # Login, signup, token refresh, email verification
│   │       │   ├── complaints/     # Complaint CRUD and resolution
│   │       │   ├── expenses/       # Expense tracking and approval
│   │       │   ├── hostels/        # Hostel CRUD and configuration
│   │       │   ├── managers/       # Manager assignment and management
│   │       │   ├── notifications/  # In-app and email notifications
│   │       │   ├── owner-requests/ # Owner registration approvals
│   │       │   ├── payments/       # Payment processing and invoicing
│   │       │   ├── rooms/          # Room and bed management
│   │       │   ├── students/       # Student lifecycle management
│   │       │   ├── upload/         # File upload handling (Cloudinary)
│   │       │   └── users/          # User profile and account management
│   │       ├── routes/             # Route aggregation
│   │       ├── utils/              # Helpers, error classes, email templates
│   │       ├── app.ts              # Express app setup
│   │       └── server.ts           # Server entry point
│   │
│   └── frontend/                   # Next.js 16 + React 19
│       ├── app/
│       │   ├── components/         # Landing page sections (Hero, Features, FAQ, etc.)
│       │   ├── admin/              # Admin dashboard pages
│       │   ├── owner/              # Owner dashboard pages
│       │   ├── manager/            # Manager dashboard pages
│       │   ├── student/            # Student dashboard pages
│       │   ├── login/              # Authentication pages
│       │   ├── signup/             # Registration pages
│       │   └── verify-email/       # Email verification flow
│       ├── components/             # Shared UI components
│       ├── lib/                    # API services, store, hooks
│       └── public/                 # Static assets
│
├── packages/
│   ├── shared-types/               # TypeScript interfaces
│   ├── shared-constants/           # Enums, roles, status codes
│   └── shared-validators/          # Zod schemas
│
├── render.yaml                     # Render deployment config
├── tsconfig.base.json              # Base TypeScript config
└── package.json                    # Monorepo root (npm workspaces)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0
- **MongoDB Atlas** account ([free tier available](https://www.mongodb.com/atlas))
- **Cloudinary** account for file uploads ([free tier available](https://cloudinary.com/))

### Installation

```bash
git clone https://github.com/hussainjamal760/Hostel-Management.git
cd Hostel-Management

npm install
```

### Build Shared Packages

Shared packages must be built before running the apps:

```bash
npm run build:shared
```

### Run Development Servers

```bash
npm run dev:backend

npm run dev:web
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:3000`.

---

## 🔑 Environment Variables

Create a `.env` file inside `apps/backend/` with the following variables:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostelite

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

FRONTEND_URL=http://localhost:3000
```

Create a `.env.local` file inside `apps/frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📜 Available Scripts

Run from the **monorepo root**:

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend dev server with hot reload |
| `npm run dev:web` | Start frontend Next.js dev server |
| `npm run build:shared` | Build all shared packages |
| `npm run build:backend` | Compile backend TypeScript |
| `npm run build:web` | Build frontend for production |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format all files with Prettier |
| `npm run clean` | Remove all `node_modules` and `dist` folders |

Run from `apps/backend/`:

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests with Vitest |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |

---

## 📖 API Documentation

The backend exposes a RESTful API organized by feature modules:

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/api/auth` | Login, signup, token refresh, email verification |
| Users | `/api/users` | User profile and account management |
| Hostels | `/api/hostels` | Hostel CRUD operations |
| Rooms | `/api/rooms` | Room configuration and availability |
| Students | `/api/students` | Student registration and management |
| Managers | `/api/managers` | Manager assignment and operations |
| Expenses | `/api/expenses` | Expense tracking and approval |
| Payments | `/api/payments` | Payment processing and invoicing |
| Complaints | `/api/complaints` | Complaint filing and resolution |
| Notifications | `/api/notifications` | In-app notification management |
| Owner Requests | `/api/owner-requests` | Owner registration approvals |
| Admin | `/api/admin` | Platform administration |
| Upload | `/api/upload` | File and image uploads |

---

## 🚢 Deployment

### Frontend — Vercel

The frontend is deployed on **Vercel** with automatic deployments on push.

🔗 **Live URL:** [https://hostel-management-frontend-ten.vercel.app/](https://hostel-management-frontend-ten.vercel.app/)

### Backend — Render

The backend is deployed on **Render** using the `render.yaml` blueprint:

- **Build:** `npm install && npm run build:shared && npm run build:backend`
- **Start:** `node apps/backend/dist/server.js`
- **Plan:** Free tier
- **Runtime:** Node.js

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using the MERN Stack + TypeScript**

[Live Demo](https://hostel-management-frontend-ten.vercel.app/) · [Report Bug](https://github.com/hussainjamal760/Hostel-Management/issues) · [Request Feature](https://github.com/hussainjamal760/Hostel-Management/issues)

</div>

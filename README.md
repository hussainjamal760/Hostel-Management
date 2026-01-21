# Hostelite HMS 🏨

A complete Hostel Management System built with **MERN Stack + React Native** and **TypeScript**.

## 🏗️ Architecture

```
ADMIN → OWNER → MANAGER → STUDENT
```

- **ADMIN**: Platform super admin (multi-tenancy support)
- **OWNER**: Hostel owner (can own multiple hostels)
- **MANAGER**: Day-to-day operations manager
- **STUDENT**: Hostel resident

## 📁 Project Structure

```
hostelite/
├── apps/
│   ├── backend/          # Express + TypeScript API
│   ├── web-admin/        # React + Vite Admin Dashboard
│   └── mobile-app/       # React Native + Expo
│
├── packages/
│   ├── shared-types/     # TypeScript interfaces
│   ├── shared-constants/ # Roles, enums, statuses
│   ├── shared-validators/# Zod validation schemas
│   └── shared-utils/     # Common utilities
│
└── package.json          # Monorepo root
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- MongoDB Atlas account (free tier)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hostelite

# Install all dependencies
npm install

# Setup environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your values

# Run backend
npm run dev:backend

# Run web admin (in another terminal)
npm run dev:web

# Run mobile app (in another terminal)
npm run dev:mobile
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Web Frontend | React, Vite, TypeScript |
| Mobile | React Native, Expo |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Zod |
| File Storage | Cloudinary |
| Push Notifications | Firebase FCM |
| Email | SendGrid / Google SMTP |
| Payments | JazzCash, EasyPaisa, 1Bill |

## 📝 API Documentation

API documentation is available at `/api/docs` when running the backend.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test -w apps/backend

# Run web tests only
npm run test -w apps/web-admin
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

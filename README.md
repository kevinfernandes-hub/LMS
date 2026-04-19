# 🎓 Acadify - Premium Learning Management System

Acadify is a modernized, professional LMS portal designed for students and teachers. It features a sleek glassmorphic UI, interactive dashboards, and a robust backend built for production.

## 🚀 Features

### 👨‍🎓 For Students
- **Interactive Dashboard**: Track your course progress and upcoming deadlines with a beautiful, high-contrast UI.
- **Premium Calendar**: Monthly grid view with integrated "Day Manifest" and milestone tracking.
- **Course Exploration**: Access high-quality curriculum data including Harvard's CS50 SQL and Advanced Mathematics.
- **Assignment Portal**: Seamless submission system with support for file uploads and private teacher comments.
- **Transcript View**: Professional performance visualization with Recharts.

### 👨‍🏫 For Teachers
- **Gradebook**: Effortless student assessment with integrated feedback tools.
- **Course Management**: Create modules, upload materials, and generate unique invite codes for students.
- **Announcement System**: Real-time communication with students including nested comment threads.

## 🛠 Tech Stack
- **Frontend**: React, Vite, Framer Motion, TailwindCSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, PostgreSQL, JWT, Helmet (Security), Compression.
- **Database**: Neon (Serverless PostgreSQL).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Neon)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kevinfernandes-hub/LMS.git
   ```
2. Install dependencies:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```
3. Configure environment variables in `backend/.env`.

### Running Locally
```bash
# Start Backend (Port 5001)
cd backend && npm run dev

# Start Frontend (Port 5173)
cd frontend && npm run dev
```

## 🔒 Production
The app is hardened for production with:
- `helmet` security headers.
- `express-rate-limit` protection.
- Response compression for speed.
- Secure, serverless database on Neon.

---
Built with ❤️ for professional educators and students.

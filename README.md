# 📚 AS Publications - Book Inventory Management System

A full-stack Book Inventory Management System built for AS Publications to manage book inventory, stock, pricing, and cover images.

## 🌐 Live Demo

Frontend:
https://book-inventory-management-applicati.vercel.app

Backend API:
https://as-publications-api.onrender.com

---

## Features

- 🔐 JWT Authentication
- 📚 Add, Edit & Delete Books
- 🖼 Upload Book Cover Images
- 📦 Inventory Management
- 📊 Dashboard Statistics
- 🔍 Search Books
- 📄 Pagination
- ☁️ Fully Deployed

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Multer

### Database
- Supabase PostgreSQL

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## Project Structure

```
client/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── assets/

src/
├── controllers/
├── middleware/
├── routes/
├── services/
├── prisma/
└── uploads/
```

---

## Environment Variables

### Backend

```
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=
```

### Frontend

```
VITE_API_URL=
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/AzadSwailim/Book-Inventory-Management-Application.git
```

### Backend

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Screenshots

### Login

(Add Screenshot)

### Dashboard

(Add Screenshot)

### Books Page

(Add Screenshot)

---

## Author

**Azad Swailim**

GitHub:
https://github.com/AzadSwailim

---

## License

This project is for educational and portfolio purposes.
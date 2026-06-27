# AS Publications – Book Inventory Management System

A full-stack Book Inventory Management System developed for **AS Publications** to manage paperback books, inventory, pricing, and cover images. The application is designed as a production-ready admin dashboard with secure authentication, cloud-based image storage, and a modern responsive interface.

---

# Live Demo

**Frontend (Vercel)**  
https://as-publications-admin.vercel.app

**Backend API (Render)**  
https://as-publications-api.onrender.com

---

# Features

- Secure Admin Login using JWT Authentication
- Add new books
- Update existing books
- Delete books
- Upload book cover images
- Search books by title
- Pagination
- Sorting support
- Responsive Admin Dashboard
- Cloud image storage using Supabase Storage
- PostgreSQL database hosted on Supabase
- RESTful API architecture

---

# Tech Stack

## Frontend

- React.js
- React Router
- Axios
- React Hot Toast
- React Icons
- CSS

## Backend

- Node.js
- Express.js
- Prisma ORM
- Multer
- JWT
- bcrypt
- Supabase Storage

## Database

- PostgreSQL (Supabase)

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → Supabase
- Image Storage → Supabase Storage

---

# Project Structure

```
bookstore-admin
│
├── client
│   ├── src
│   ├── public
│   └── ...
│
├── server
│   ├── prisma
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── ...
│
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/AzadSwailim/Book-Inventory-Management-Application.git
```

## Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd server
npm install
```

---

# Environment Variables

## Backend (.env)

```
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
JWT_SECRET=your_secret_key

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Frontend (.env)

```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

# Running Locally

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---

# API Endpoints

## Authentication

```
POST /auth/login
```

---

## Books

```
GET    /books
GET    /books/:id
POST   /books
PUT    /books/:id
DELETE /books/:id
```

---

# Authentication

- JWT-based authentication
- Protected routes
- Token stored in Local Storage
- Axios interceptor for authenticated requests

---

# Image Upload Workflow

1. Admin uploads a book cover.
2. Multer stores the file in memory.
3. Backend uploads the image to Supabase Storage.
4. Supabase returns a public URL.
5. The URL is stored in PostgreSQL.
6. Frontend displays the image directly from Supabase.

---

# Challenges Faced

## 1. Images disappeared after deployment

### Problem

Initially, uploaded images were stored in the local `uploads` folder.

```
uploads/
```

Everything worked locally, but after deploying to Render, images disappeared after every redeploy because Render's filesystem is ephemeral.

### Solution

Migrated image storage from local disk to **Supabase Storage**.

Changes made:

- Replaced `multer.diskStorage()` with `multer.memoryStorage()`
- Uploaded image buffers directly to Supabase Storage
- Stored public image URLs instead of local file paths
- Deleted old images from Supabase when updating a book
- Deleted associated images from Supabase when deleting a book

Result:

Book cover images now persist permanently across deployments.

---

## 2. Broken Images After Migration

### Problem

Previously uploaded books still pointed to old Render URLs.

Example:

```
https://as-publications-api.onrender.com/uploads/image.jpg
```

Since those files no longer existed, the images were broken.

### Solution

Re-uploaded book covers so new Supabase URLs were stored.

Example:

```
https://<project>.supabase.co/storage/v1/object/public/book-covers/image.jpg
```

---

## 3. Single Page Application Routing

### Problem

Refreshing pages such as:

```
/books
/dashboard
```

returned a **404 NOT FOUND** error on Vercel.

### Solution

Added a `vercel.json` rewrite configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router handles all client-side routes correctly.

---

## 4. API URL Issues

### Problem

Some components used hardcoded URLs such as:

```
http://localhost:3000
```

which caused production failures.

### Solution

Moved all API URLs to environment variables.

```
VITE_API_URL
```

This allows seamless switching between local development and production.

---

## 5. CORS Errors

### Problem

Requests from the deployed Vercel frontend were blocked by the backend.

### Solution

Configured Express CORS to allow the deployed frontend domain.

---

# Future Improvements

- Customer-facing online bookstore
- Order management
- Inventory analytics dashboard
- ISBN support
- Category management
- Author management
- Low stock notifications
- Image optimization using Sharp
- UUID-based image filenames
- Role-based access control
- Audit logs
- Docker support
- CI/CD pipeline with GitHub Actions

---

# Lessons Learned

Through this project I learned:

- Building production-ready REST APIs
- JWT Authentication
- Prisma ORM
- PostgreSQL
- Cloud deployment
- Environment variable management
- React application deployment
- Supabase Storage integration
- File upload handling with Multer
- Solving deployment-specific issues
- Production debugging
- Clean backend architecture using Controllers, Services, and Middleware

---

# Author

**Azad Swailim**

GitHub: https://github.com/AzadSwailim

---
**This project was built as a production-ready inventory management system for AS Publications.**
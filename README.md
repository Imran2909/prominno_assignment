# Prominno Node.js Assignment

A full-stack TypeScript implementation for the Prominno seller/product assignment. The project is organized as a scalable company-style codebase with a Node.js API, MongoDB persistence, Joi validation, JWT authentication, role-based authorization, backend-generated product PDFs, and a React dashboard UI inspired by the provided reference screenshots.

## Tech Stack

**Backend**

- Node.js, Express, TypeScript
- MongoDB with Mongoose
- Joi request validation
- JWT authentication and role middleware
- Bcrypt password hashing
- PDFKit for product PDF generation
- Centralized error handling and typed response helpers

**Frontend**

- React, TypeScript, Vite
- React Router
- Axios API client with auth interceptor
- React Hot Toast notifications
- Lucide React icons
- Responsive dashboard layout

## Folder Structure

```text
prominno_assignment/
  backend/
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      services/
      types/
      utils/
      validations/
  frontend/
    vite-project/
      src/
        api/
        components/
        layouts/
        pages/
        routes/
        styles/
        types/
        utils/
```

## Backend API

Base URL: `http://localhost:5000/api/v1`

### Auth

- `POST /auth/admin/login` - admin login, returns JWT and role.
- `POST /auth/seller/login` - seller login, returns JWT and role.

### Admin

- `POST /admin/sellers` - create seller. Admin token required.
- `GET /admin/sellers?page=1&limit=10` - paginated seller list. Admin token required.

### Seller

- `POST /seller/products` - create seller-owned product with multiple brands. Seller token required.
- `GET /seller/products?page=1&limit=10` - paginated product list scoped to authenticated seller.
- `GET /seller/products/:id/pdf` - view/download product PDF scoped to authenticated seller.
- `DELETE /seller/products/:id` - delete seller-owned product.

## Environment Setup

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_secret
JWT_EXPIRES_IN=7d
ADMIN_NAME=Prominno Admin
ADMIN_EMAIL=admin@prominno.com
ADMIN_PASSWORD=Admin@12345
CLIENT_ORIGIN=http://localhost:5173
```

Create `frontend/vite-project/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Run Commands

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend/vite-project
npm install
npm run dev
```

Build checks:

```bash
cd backend && npm run build
cd frontend/vite-project && npm run build
```

## Feature Checklist

- Admin login with seeded admin credentials from environment.
- Admin-only seller creation with strict Joi validation.
- Admin-only seller listing with pagination.
- Seller login using credentials created by admin.
- Seller-only product creation with multiple brands.
- Brand image upload converted to base64 string and stored in MongoDB.
- Seller-only product listing with pagination.
- Seller-only product deletion with ownership protection.
- Backend-generated product PDF with product details, brand details, images, and total price.
- Typed Express request context, modular services/controllers/routes, and centralized error responses.
- React dashboard UI matching the provided reference direction.

## Notes

- Images are stored as base64 data URLs in MongoDB as requested.
- Product PDF generation is handled by the backend so authorization and ownership checks remain server-side.
- The frontend stores the JWT and role in localStorage and protects routes by role.
- All request bodies, params, and pagination queries are validated before reaching controllers.

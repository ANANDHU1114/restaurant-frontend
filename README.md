# Restaurant Ordering System (Full Stack)

This repository contains a simple full-stack restaurant ordering system with separate `backend` and `frontend` folders.

Structure

- `backend/` - Express + Mongoose API
- `frontend/` - Vite + React UI

Quick start (Windows PowerShell)

1. Start MongoDB locally or use a cloud MongoDB URI.
2. Backend:

   cd "C:/Users/ANANDHU/rest order sys/backend"
   Copy-Item .env.example .env
   # edit .env to set MONGO_URI if needed
   npm install
   
   # Optional: Seed the database with sample menu items
   npm run seed
   
   # Start the server
   npm run dev

   # Optional: Create an admin automatically when starting the server (dev only)
   # Usage (PowerShell):
   # $env:CREATE_ADMIN_ON_START='true'; $env:ADMIN_EMAIL='admin@you.com'; $env:ADMIN_PASSWORD='StrongPass123'; npm run dev
   # The server will create the admin user if it does not already exist.

3. Frontend (in a new terminal):

   cd "C:/Users/ANANDHU/rest order sys/frontend"
   npm install
   npm run dev

Open the frontend at http://localhost:3000. The frontend proxies API requests to http://localhost:5000.

Testing the flow

1. Admin (http://localhost:3000/admin):
   - View seeded menu items (Margherita Pizza etc.)
   - Add new items with name, description, price, category, image URL
   - Edit/delete existing items

2. Menu (http://localhost:3000):
   - Browse menu items in a grid
   - Add items to cart

3. Cart (http://localhost:3000/cart):
   - Adjust quantities
   - Enter customer name and email
   - Complete checkout

4. Orders (http://localhost:3000/orders):
   - View all orders with status
   - See order details (items, total, customer info)

Notes

- The backend exposes CRUD endpoints at `/api/orders` and `/api/menu`.
- Order model: customerName (required), email, tableNumber, items, status, total (auto-calculated).
- MenuItem model: name (required), description, price (required), category, imageUrl, available.

# Restaurant Ordering Backend

This is the Express + MongoDB backend for the restaurant ordering system. It exposes CRUD endpoints for orders.

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies:

   npm install

3. Run in development mode (with nodemon):

   npm run dev

API endpoints (base: /api/orders)

- POST /api/orders - create order
- GET /api/orders - list orders (optional ?search=term)
- GET /api/orders/:id - get order
- PUT /api/orders/:id - update order
- DELETE /api/orders/:id - delete order

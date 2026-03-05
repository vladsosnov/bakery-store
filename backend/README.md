# backend

Node.js + Express + TypeScript backend for Bakery Store.

## Structure

- `src/config/` environment and app config
- `src/controllers/` request handlers
- `src/db/` MongoDB connection and DB helpers
- `src/middleware/` express middleware
- `src/models/` Mongoose models
- `src/routes/` route modules
- `src/services/` business logic
- `src/sockets/` WebSocket setup and events
- `src/types/` backend TypeScript types
- `src/utils/` utility helpers
- `tests/` backend tests
- `docs/` API documentation (OpenAPI/Swagger)

## Run

1. `npm install`
2. `npm run dev`

Backend starts on `http://localhost:4000` by default.

## Endpoints

- `GET /api/healthcheck`
- `GET /api/openapi.json`
- `GET /api/docs`
- `POST /api/auth/register`
  - body:
    - `firstName: string`
    - `lastName: string`
    - `email: string`
    - `password: string` (min 8 chars)

## Admin Seeding (Code-only)

To create the initial admin automatically on startup, set env vars:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FIRST_NAME` (optional, default `Admin`)
- `ADMIN_LAST_NAME` (optional, default `User`)

Admin is created only if no admin exists yet.

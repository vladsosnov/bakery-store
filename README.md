# bakery-store

[![CI](https://github.com/vladsosnov/bakery-store/actions/workflows/ci.yml/badge.svg)](https://github.com/vladsosnov/bakery-store/actions/workflows/ci.yml)
[![Frontend Coverage](https://codecov.io/gh/vladsosnov/bakery-store/graph/badge.svg?flag=frontend&branch=main)](https://codecov.io/gh/vladsosnov/bakery-store)
[![Backend Coverage](https://codecov.io/gh/vladsosnov/bakery-store/graph/badge.svg?flag=backend&branch=main)](https://codecov.io/gh/vladsosnov/bakery-store)

Bakery Store is a full-stack e-commerce project built to demonstrate production-style frontend and backend development with testing, CI, API docs, and deployment.

## Project Demo

Live links:

- Frontend (GitHub Pages): [https://vladsosnov.github.io/bakery-store/](https://vladsosnov.github.io/bakery-store/)
- Backend API (Render): [https://bakery-store-7z31.onrender.com](https://bakery-store-7z31.onrender.com)
- Swagger docs: [https://bakery-store-7z31.onrender.com/api/docs](https://bakery-store-7z31.onrender.com/api/docs)

- - - - - - - - - - - - - - - - -

- Admin dashboard (MP4): [docs/demo/admin-dashboard.mp4](docs/demo/admin-dashboard.mp4)
- Moderator chat flow (MP4): [docs/demo/chat.mp4](docs/demo/chat.mp4)

## What Is Implemented

- Authentication and authorization (customer, moderator, admin)
- Product catalog with filtering/search/tags
- Cart and order workflows
- Profile management
- Admin dashboard for users/moderators/orders
- Admin analytics charts (orders activity, registrations, status pipeline) with Highcharts
- WebSocket integration (Socket.IO) for real-time chat
- API documentation (Swagger/OpenAPI)
- Unit tests for frontend and backend
- GitHub Actions CI + Codecov coverage reporting

## Stack

- Frontend: React, TypeScript, Vite, styled-components, Highcharts, Jest, Testing Library
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Swagger, Socket.IO, Jest
- DevOps: GitHub Actions, Codecov, GitHub Pages (frontend), Render (backend)

## Repository Structure

- `frontend/` client application
- `backend/` API server
- `.github/workflows/` CI and deploy pipelines

## Local Setup

Prerequisites:

- Node v20
- MongoDB Atlas URI (or local MongoDB)

Install dependencies:

```bash
cd frontend && yarn
cd ../backend && yarn
```

Run locally (in separate terminals):

```bash
cd backend && yarn dev
```

```bash
cd frontend && yarn dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- API docs: `http://localhost:4000/api/docs`

## Deployment

- Frontend is deployed to GitHub Pages.
- Backend is configured for Render Web Service deployment.
- Note: on Render free tier, the backend sleeps after inactivity and cold start can take up to ~3 minutes before the first API response.
- Frontend build uses `VITE_API_URL` to call the backend API.

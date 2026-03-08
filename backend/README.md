# Backend

Backend application for Bakery Store.

## Run

```bash
yarn
yarn dev
```

Backend starts on `http://localhost:4000` by default.

## API Docs

- Swagger UI: `GET /api/docs`
- OpenAPI JSON: `GET /api/openapi.json`
- Healthcheck: `GET /api/healthcheck`

## Env

Required:

- `MONGODB_URI`
- `JWT_SECRET` (min 16 chars)

Common:

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT` (default `4000`)
- `CORS_ORIGINS` (comma-separated; default `http://localhost:5173,https://vladsosnov.github.io`)
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (min 8 chars)
- `ADMIN_FIRST_NAME` (default `admin`)
- `ADMIN_LAST_NAME` (default `admin`)

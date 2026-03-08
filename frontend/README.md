# Frontend

Frontend application for Bakery Store.

## Run

```bash
yarn
yarn dev
```

Default URL: `http://localhost:5173`

## Env

- `VITE_API_URL`: backend base URL used in production build
  - Example: `https://your-backend-domain.com`

For local development, Vite proxy routes `/api/*` to `http://localhost:4000`.

## Tests and Lint

```bash
npm run test
npm run test:coverage
npm run lint
npm run typecheck
```

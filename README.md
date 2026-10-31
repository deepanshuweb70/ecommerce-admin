# ShopPanel — E-Commerce Admin Dashboard

A responsive React admin dashboard for reviewing sales, managing inventory and users, and browsing order history. The app uses a local JSON Server REST API for demo data.

## Features

- Dashboard KPIs with orders-by-status and paid-sales trend charts
- Inventory search, category filter, sortable columns, pagination, and add/edit/delete forms
- User management with add/edit/delete and React Hook Form + Zod validation
- Order history with fulfillment and payment status filters
- React Router routes with a demo sign-in guard
- Redux Toolkit for session and theme state
- Axios + TanStack React Query for API access, caching, and mutation refreshes
- Responsive layout, dark/light theme, and loading/error states

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

The `dev` command starts Vite and the JSON Server mock API together. Open the local URL printed by Vite. The API listens on port `3001` and Vite proxies `/api` requests to it.

To run the servers separately, use two terminals:

```bash
npm run dev:web
npm run dev:api
```

The API data is in `db.json`. JSON Server writes product and user changes back to that file.

Copy `.env.example` to `.env` only if you need to change the API URL. `VITE_API_URL` is blank for local development; when deployed, point it to a separately hosted API.

## Demo sign-in

The login screen is a client-side demo guard, not production authentication. Use any valid email and any non-empty password. No credentials are sent or stored; the demo session lives in the current browser tab.

## Scripts

```bash
npm run dev       # Vite + mock API
npm run dev:web   # Vite only
npm run dev:api   # JSON Server only
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview the production build
```

## Deployment note

The included `vercel.json` supports React Router page refreshes on Vercel. The frontend still needs a separately hosted API for a deployed demo: configure `VITE_API_URL` in the hosting dashboard to that API's URL. JSON Server is intended for local demos, not as a production backend.

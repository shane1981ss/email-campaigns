# Email Campaigns

An Express web app for managing email campaigns, built with Prisma (MySQL), EJS, and EJS Layouts.

## Stack

- **Express** — web framework
- **Prisma** — ORM (MySQL)
- **EJS + express-ejs-layouts** — templating
- **Helmet** — security headers
- **express-rate-limit** — rate limiting

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update your MySQL credentials:

```bash
cp .env.example .env
```

```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/email_campaigns"
PORT=3000
```

### 3. Initialize the database

```bash
npm run db:push
```

### 4. Start the app

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|---|---|
| `npm start` | Start the server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run database migrations (dev) |
| `npm run db:push` | Sync schema to database (initial setup) |
| `npm run db:studio` | Open Prisma Studio |

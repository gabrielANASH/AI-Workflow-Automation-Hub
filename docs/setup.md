# Setup Guide

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | >= 18.x | Download from [nodejs.org](https://nodejs.org/) |
| **npm** | >= 9.x | Bundled with Node.js |
| **PostgreSQL** | >= 14.x | Local install or cloud (Neon, Supabase, Railway) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Gemini API Key** | — | Get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/ai-workflow-automation.git
cd ai-workflow-automation

# Install all dependencies
npm install
```

This runs `postinstall` which auto-generates the Prisma client.

---

## Environment Configuration

### 1. Create environment file

```bash
cp .env.example .env
```

### 2. Configure required variables

Open `.env` and fill in:

```env
# ── Database ──────────────────────────────────────────────
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flowmind

# Or Neon (cloud)
# DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/flowmind?sslmode=require

# ── Authentication ────────────────────────────────────────
# Generate with: openssl rand -base64 32
JWT_SECRET=your-256-bit-secret-change-in-production

# ── AI Providers ──────────────────────────────────────────
GEMINI_API_KEY=your-gemini-api-key-here
```

---

## Database Setup

### 1. Create the database

```bash
# Local PostgreSQL
createdb flowmind

# Or via psql
psql -U postgres -c "CREATE DATABASE flowmind;"
```

### 2. Push the schema

```bash
npx prisma generate   # Generate Prisma client (also runs on npm install)
npx prisma db push    # Push schema to database (creates tables)
npx prisma db push --accept-data-loss  # If schema changed since last push
```

### 3. Optional: Seed built-in templates

```bash
npm run db:seed
```

Seeds 4 workflow templates:
- **Customer Support** — Auto-classify support tickets with AI, then send priority-based notifications
- **Lead Scoring** — Score inbound leads using AI analysis and route to sales
- **Content Moderation** — AI-powered content review pipeline
- **Daily Report** — Generate AI summaries and send scheduled email reports

---

## Running the App

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build    # Generates Prisma client + optimizes build
npm start        # Starts on port 3000
```

---

## First-Time Setup Walkthrough

After starting the dev server:

1. **Register** — Navigate to `/register`, create an account
2. **Dashboard** — You'll see empty stats, create your first workflow
3. **Create workflow** — Click "New Workflow" or use a template
4. **Build** — Add blocks to the canvas:
   - **Trigger** — The starting point (no configuration needed)
   - **AI Action** — Paste a prompt, select a model (Gemini 2.5 Flash)
   - **Condition** — Evaluate AI output (e.g., `block_2.priority == "high"`)
   - **Email / Notification** — Output actions
5. **Save** — Click save in the builder toolbar
6. **Run** — Click the run button, view execution results
7. **Monitor** — Check run history and analytics

---

## NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Generate Prisma client + production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint across all files |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed workflow templates |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Troubleshooting

| Issue | Likely Cause | Solution |
|---|---|---|
| `PrismaClientInitializationError` | Database not running or wrong URL | Verify PostgreSQL is running and `DATABASE_URL` is correct |
| `AIAuthenticationError: gemini` | Missing or invalid API key | Check `GEMINI_API_KEY` in `.env`, confirm at [aistudio.google.com](https://aistudio.google.com/) |
| `ECONNREFUSED` on database | PostgreSQL not started | `brew services start postgresql` (Mac) or `systemctl start postgresql` (Linux) |
| `Module not found` errors | Dependencies not installed | Run `npm install` |
| `Port 3000 in use` | Another process on port 3000 | Kill process or set `PORT=3001 npm run dev` |
| `JWT malformed` in logs | JWT_SECRET changed | Clear browser cookies or use a consistent secret |
| Build fails with TypeScript errors | Type mismatch | Check the specific file, ensure `strict` mode compliance |
| `User does not own this resource` | Wrong workflow ID | Verify the workflow URL or check the user ID |
| Rate limit errors (429) | Too many requests | Wait 1 minute or reduce `RATE_LIMIT_MAX` |
| Prisma client not found | Client not generated | Run `npx prisma generate` |

---

## Environment Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |
| `LOG_LEVEL` | No | `info` | Logging verbosity: `debug`, `info`, `warn`, `error` |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per minute per IP |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public app URL |
| `PORT` | No | `3000` | Server port override |

---

## Tech Stack Cheatsheet

```bash
# Prisma
npx prisma studio             # GUI database browser
npx prisma db push            # Push schema changes
npx prisma generate           # Regenerate client
npx prisma validate           # Validate schema

# Next.js
npm run build                 # Production build
npm run dev                   # Dev server with HMR

# Linting
npm run lint                  # ESLint check
```

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual

```bash
npm run build
npm start
```

Use a process manager (PM2) for production:

```bash
npm install -g pm2
pm2 start npm --name "flowmind" -- start
```

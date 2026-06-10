# AI Workflow Automation Hub

<div align="center">

**A full-stack, AI-powered workflow automation platform with a visual drag-and-drop builder, multi-step execution engine, and real-time analytics.**


![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)
![MIT License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Overview

AI Workflow Automation Hub lets users create, configure, and execute multi-step automation workflows through an intuitive visual canvas — no coding required. Each workflow can combine trigger events, AI-powered analysis via Gemini, conditional branching, email notifications, and more.

Built for production with Next.js 15 App Router, TypeScript, Prisma + PostgreSQL, and a clean layered architecture.

---

## Key Features

### Visual Workflow Builder
- Drag-and-drop canvas with 6 block types: **Trigger, AI Action, Condition, Email, Notification, Delay**
- Real-time property editing via side panel
- Workflow persistence with auto-save
- Template gallery for quick starts

### AI Execution Engine
- Gemini API integration for AI-powered text generation
- Dynamic prompt templating using `{{variable}}` syntax
- Automatic variable propagation between blocks
- AI output normalization (strips markdown fences, parses JSON)
- Token usage and cost tracking per model
- Pre-execution key validation

### Conditional Branching
- Evaluate conditions against AI outputs and workflow variables
- Variable path resolution (e.g., `block_2.priority`)
- Multi-branch execution support

### Dashboard & Analytics
- Execution history with run status monitoring
- Token usage and cost charts
- Success/failure rate metrics
- Activity feed

### Authentication & Security
- JWT-based auth with HTTP-only cookies
- Refresh token rotation (15 min access / 7-day refresh)
- bcrypt password hashing
- Rate limiting per IP
- Route protection via middleware

### Production Infrastructure
- Structured logging with Pino
- Request validation with Zod
- Centralized error handling
- Health check endpoint
- API versioning (`/api/v1/`)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | SSR, RSC, Route Handlers |
| **TypeScript** (strict) | Full type safety |
| **Tailwind CSS v3** | Utility-first styling |
| **Framer Motion** | Drag-and-drop, animations |
| **Shadcn UI** | Radix-based accessible components |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js Route Handlers** | REST API endpoints |
| **Prisma 6** | Type-safe ORM |
| **PostgreSQL 14+** | Primary database |
| **Zod** | Schema validation |
| **Pino** | Structured JSON logging |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT auth |

### AI
| Technology | Purpose |
|---|---|
| **Gemini API** | AI text generation |
| **@google/generative-ai** | Official SDK |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client UI (React)                       │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Dashboard│  │ Workflow     │  │ Analytics & Runs      │ │
│  │          │  │ Builder      │  │                       │ │
│  └──────────┘  └──────────────┘  └───────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Next.js App Router / Middleware                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Auth Guard   │  │ Rate Limiter │  │ Request Logger   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    API Routes (REST)                         │
│  /api/auth  /api/workflows  /api/runs  /api/agents          │
│  /api/templates  /api/health  /api/usage                    │
└───────┬──────────────────────────────┬──────────────────────┘
        │                              │
┌───────▼──────────┐    ┌──────────────▼──────────────────────┐
│  Execution Engine │    │        Service Layer                │
│  ┌──────────────┐ │    │  ┌─────────┐  ┌────────────────┐  │
│  │ Context Mgr  │ │    │  │ Auth   │  │ Workflow       │  │
│  │ Block Runner │ │    │  │ Service│  │ Service        │  │
│  │ Var Prop     │ │    │  └─────────┘  └────────────────┘  │
│  └──────┬───────┘ │    │  ┌─────────┐  ┌────────────────┐  │
│         │         │    │  │ Agent   │  │ Template       │  │
│         ▼         │    │  │ Service │  │ Service        │  │
│  ┌──────────────┐ │    │  └─────────┘  └────────────────┘  │
│  │ Workflow     │ │    └──────────────┬──────────────────────┘
│  │ Blocks       │ │                   │
│  └──────┬───────┘ │                   │
└─────────┼─────────┘                   │
          │                             │
┌─────────▼─────────────────────────────▼────────────────────┐
│                    AI Service Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐  │
│  │ Gemini     │  │ OpenAI     │  │ Anthropic (future)   │  │
│  │ Provider   │  │ (ext.)     │  │                      │  │
│  └────────────┘  └────────────┘  └──────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Prisma ORM / PostgreSQL                         │
│  11 models: User, Workflow, WorkflowRun, Agent,             │
│  Team, TeamMember, Subscription, UsageLog, Session,         │
│  WorkflowTemplate, APIKey                                   │
└─────────────────────────────────────────────────────────────┘
```

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

---

## Folder Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (11 models)
│   └── seed.ts                # Built-in workflow templates
├── public/
│   ├── screenshots/           # Portfolio screenshots
│   └── demo/                  # Demo assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Dashboard pages (protected)
│   │   ├── api/               # REST API route handlers
│   │   ├── login/             # Login page
│   │   ├── register/          # Register page
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Shadcn UI primitives
│   │   ├── workflows/         # Workflow components
│   │   ├── auth/              # Auth components
│   │   ├── dashboard/         # Dashboard components
│   │   └── agents/            # Agent components
│   ├── lib/
│   │   ├── ai/                # AI provider abstraction
│   │   │   ├── providers/     # Provider implementations
│   │   │   ├── models.ts      # Central model registry
│   │   │   ├── service.ts     # AI service layer
│   │   │   └── errors.ts      # AI error types
│   │   ├── execution/         # Workflow execution engine
│   │   │   ├── blocks/        # Block executors
│   │   │   ├── engine.ts      # Core engine
│   │   │   ├── normalize.ts   # Output normalization
│   │   │   └── service.ts     # Execution service
│   │   ├── api/               # API utilities
│   │   ├── auth/              # Auth utilities
│   │   ├── database/          # Database client
│   │   ├── templates/         # Template system
│   │   └── workflows/         # Workflow utilities
│   ├── middleware.ts          # Edge middleware
│   └── types/                 # TypeScript types
├── docs/
│   ├── architecture.md        # System architecture docs
│   └── setup.md               # Setup guide
├── .env.example               # Environment template
├── .gitignore
├── LICENSE                    # MIT
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Setup

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x (or Neon, Supabase cloud instance)

### Quick Start

```bash
# Clone
git clone https://github.com/<your-username>/ai-workflow-automation.git
cd ai-workflow-automation

# Install
npm install

# Configure environment
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY

# Database
npx prisma generate
npx prisma db push

# Seed templates (optional)
npm run db:seed

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

### Production Build

```bash
npm run build
npm start
```

For detailed setup, see [docs/setup.md](docs/setup.md).

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| **Database** | | | |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| **Auth** | | | |
| `JWT_SECRET` | Yes | — | Secret for signing JWT tokens (use `openssl rand -base64 32`) |
| **AI** | | | |
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |
| **Optional** | | | |
| `LOG_LEVEL` | No | `info` | Logging: `debug`, `info`, `warn`, `error` |
| `RATE_LIMIT_MAX` | No | `100` | Max requests/minute per IP |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public app URL |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Generate Prisma client + production build |
| `npm start` | Start production server |
| `npm run lint` | Lint all files |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed workflow templates |
| `npm run db:studio` | Open Prisma Studio |

---

## Screenshots

| Screen | Preview |
|---|---|
| Landing Page | `public/screenshots/landing-page.png` |
| Dashboard | `public/screenshots/dashboard.png` |
| Workflow Builder | `public/screenshots/workflow-builder.png` |
| Run Execution | `public/screenshots/execution-run.png` |
| Analytics | `public/screenshots/analytics.png` |

> Screenshots are placeholders — replace with actual captures for your portfolio.

### Demo

![Demo GIF](public/demo/demo.gif)

Record a walkthrough:
1. Register → 2. Create workflow from template → 3. Configure blocks → 4. Run → 5. View results

---

## Future Roadmap

- **Real-time WebSocket monitoring** — Live workflow execution streaming
- **Multi-step branching** — Visual yes/no branches on the canvas
- **Workflow versioning** — History, diff, and rollback
- **More AI providers** — OpenAI GPT-4o, Anthropic Claude
- **Agent deployment** — Deploy workflows as API endpoints
- **Team collaboration** — Multi-user workspaces with RBAC
- **Webhook triggers** — Inbound webhook support
- **Scheduled runs** — Cron-based scheduling
- **Custom Block SDK** — Plugin system for community blocks

---

## License

[MIT](LICENSE) — Free for personal and commercial use.

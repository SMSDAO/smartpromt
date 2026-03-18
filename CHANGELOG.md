# Changelog

All notable changes to SmartPromts are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎉 First Production Release

This is the first stable, production-ready release of SmartPromts — an
enterprise-grade AI prompt optimisation platform.

### Added

#### Core Platform
- AI-powered prompt optimisation supporting GPT-4, GPT-3.5 Turbo, Claude, and Gemini
- Magic-link authentication via Supabase (no password required)
- Tier-based access control: `free`, `pro`, `enterprise`, `lifetime`, `admin`
- Monthly usage tracking with automatic reset

#### Admin Panel (`/admin`)
- User management dashboard with live statistics
- Per-user tier upgrades and downgrades
- Usage counter reset
- Ban / unban user accounts
- Audit-safe: admins cannot demote themselves

#### Dashboards
- **User dashboard** (`/dashboard`) — prompt input, model selector, context field, optimisation result and improvements list, usage gauge, and upgrade banner for free-tier users
- **Admin dashboard** (`/admin`) — total users, pro users, lifetime users, and banned users counters; sortable user table with inline actions

#### Billing & Payments
- Stripe Checkout integration (subscription tiers: Pro, Enterprise)
- NFT Lifetime Pass on Base network (mint interface — coming soon)
- Stripe webhook handler for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`

#### Security & Infrastructure
- Distributed rate limiting via Upstash Redis (falls back to in-memory for local dev)
- Atomic usage-check-and-increment PostgreSQL RPC (`check_and_increment_usage`) to eliminate race conditions
- Row-Level Security (RLS) policies in Supabase
- Stripe webhook signature verification
- Next.js middleware protecting `/dashboard` and `/admin` routes
- Secure session-based authentication (no client-supplied user IDs)
- CSRF protection via Next.js built-in mechanisms
- `helmet`-style security headers configurable via `next.config.js`

#### Multi-Platform Support
- **Web** — responsive Tailwind CSS UI with dark/light theme support, mobile-first layouts
- **Desktop** — Tauri-based standalone admin desktop application (`admin-desktop/`)
- Progressive Web App (PWA)-ready design

#### CI/CD & Testing
- GitHub Actions workflow (`.github/workflows/ci.yml`) covering lint, type-check, unit tests, build, and security audit on every push, pull request, and release
- Vitest unit test suite for core utilities (`lib/rate-limit`, `lib/stripe`)
- TypeScript strict mode throughout

#### Documentation
- Comprehensive `README.md` with setup, deployment, and database instructions
- `/docs` directory: architecture, API reference, deployment guide, security posture, admin desktop guide, marketing plan
- `CHANGELOG.md` (this file)
- `.env.example` with all required and optional environment variables

### Security

- Resolved `flatted` high-severity DoS vulnerability (upgraded via `npm audit fix`)
- Resolved `ajv` moderate ReDoS vulnerability (upgraded via `npm audit fix`)

---

## Upgrading

This is the initial release — no migration steps required.

## Links

- [Repository](https://github.com/SMSDAO/SmartPromts)
- [Documentation](./docs/README.md)
- [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSMSDAO%2FSmartPromts)

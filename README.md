# FUGA – Music Product Management System

A full-stack music product management application with advanced features like infinite scrolling, hybrid search strategies, and enterprise-grade security hardening.

---

## Key Features

- 🎵 **Dynamic Product Catalog**: Browse a rich collection of music products with real-time search.
- 🚀 **Infinite Scroll**: High-performance product grid with grid optimization for large datasets.
- 🔍 **Hybrid Search Strategy**: Blazing fast client-side filtering combined with comprehensive server-side search.
- 🖼️ **Cloud Storage Support**: Local or AWS S3 integration for high-available cover art storage.
- 🛡️ **Security Hardened**: Defense-in-depth with rate limiting, API key auth, and strict CSP.
- 🧪 **Comprehensive Tested**: 44+ tests covering custom hooks, UI components, and API integration.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js · Express · TypeScript · PostgreSQL · Prisma · Zod · Multer · Helmet · Rate-Limit |
| **Frontend** | React 19 · React Compiler · Vite 7 · TypeScript · Tailwind CSS v4 · TanStack Query v5 · Redux Toolkit |
| **Infra** | Docker · Docker Compose (Dev/Prod) · GitHub Actions (CI) |

---

## Quick Start (Docker)

The fastest way to get started is using Docker Compose.

```bash
# Clone the repo
git clone <repo-url> && cd FUGA

# Create environment file (defaults provided)
cp .env.example .env

# Start all services
docker compose up --build
```

**Access points:**
- **App**: [http://localhost:3000](http://localhost:3000)
- **API Docs**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## Database Seeding (Demo Mode)

Populate your database with 50 diverse music products (albums/artists/covers) to test search and pagination.

```bash
cd backend
npm run seed
```

---

## Project Structure

```
FUGA/
 ├─ backend/
 │   ├─ src/
 │   │   ├─ config/          # Zod-validated environment config
 │   │   ├─ modules/products/ # Clean architecture: router → controller → service → repository
 │   │   ├─ middlewares/     # auth · rateLimiter · validate · errorHandler · upload
 │   │   └─ lib/             # Storage service (Local/S3) · Prisma client · Logger
 │   └─ prisma/              # Schema & migrations
 ├─ frontend/
 │   └─ src/
 │       ├─ features/products/
 │       │   ├─ components/  # ProductCard · ProductGrid · ProductForm
 │       │   ├─ containers/  # Domain-specific logic containers
 │       │   ├─ hooks/       # Custom React Query & Infinite Scroll hooks
 │       │   └─ utils/       # Business logic & validation utilities
 │       ├─ store/           # Redux Toolkit setup (global UI state)
 │       └─ lib/             # Hardened apiClient & queryClient
 └─ .github/workflows/      # Automated CI/CD pipelines
```

---

## API & Security

### Security Measures
- **Rate Limiting**: Protection against DDoS and brute-force (100 reqs/15m global, 20 reqs/15m for writes).
- **Authentication**: `X-API-KEY` required for all state-changing operations (POST/PUT/DELETE).
- **Hardened Headers**: Strict CSP, X-Frame-Options (Clickjacking protection), and HSTS.
- **Input Sanitization**: Global Zod validation middleware for all request payloads.

### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/products` | ❌ | Paginated list with search/filters |
| `GET` | `/api/products/:id` | ❌ | Detailed product view |
| `POST` | `/api/products` | ✅ | Create new product (Multipart) |
| `PUT` | `/api/products/:id` | ✅ | Update product (Multipart) |
| `DELETE` | `/api/products/:id` | ✅ | Permanently delete product |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Infinite Scroll** | Eliminates pagination latency; uses scroll-triggered data fetching for a modern mobile-first UX. |
| **Hybrid Search** | Instant UI feedback via client-side filter for loaded items + server-side fallback for large datasets. |
| **Container-Presenter**| Decouples data fetching from UI, making components pure, highly testable, and reusable. |
| **Defense in Depth** | Multiple security layers (Rate limit → Auth → Validation) ensure robust API protection. |
| **React Compiler** | Automatic memoization reduces manual `useMemo`/`useCallback` overhead while ensuring 60FPS UI. |

---

## Development

### Running Tests
```bash
# Backend (Jest)
cd backend && npm run test

# Frontend (Vitest)
cd frontend && npm run test
```

### CI (GitHub Actions)
Fully automated CI pipeline on every push:
- **Linting & Type-checking**
- **Unit & Integration Testing**
- **Production Build Validation**
- **Docker Image Build Verification**

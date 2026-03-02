# FUGA – Music Product Management System

## Overview
FUGA is a high-performance music product management system designed for a modern, music-centric environment. The platform provides a seamless interface for managing digital music assets, featuring enterprise-grade performance, accessibility, and security standards.

## Project Description
FUGA is a purpose-built product management system tailored for music companies. The system enables seamless management of digital assets with the following core capabilities:

- **Product Creation & Management**: Modern interface for creating and updating products with metadata (Name, Artist Name) and cover art uploads.
- **Dynamic Asset Library**: A high-performance viewing experience for the entire catalog, featuring optimized thumbnails and integrated product details.

---

## Technical Requirements (Implemented)

### Service (Backend - Node.js)
- **CRUD Operations**: Full Create, Read, Update, and Delete operations for managing products and artists.
- **API Endpoints**: RESTful API designed with Zod validation, comprehensive error handling, and security hardening.
- **Image Upload Handling**: Robust mechanism for handling cover art uploads using Multer, with support for both local and AWS S3 storage.
- **API Documentation**: Interactive documentation available via Swagger/OpenAPI.

### Client Application (Frontend - React)
- **UI for Product Creation**: User-friendly, accessible interface for entering product details and uploading cover art.
- **Product List Display**: High-performance grid interface with infinite scrolling, cover art thumbnails, and instant hybrid search.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js · Express · TypeScript · PostgreSQL · Prisma · Zod · Multer · Helmet · Rate-Limit |
| **Frontend** | React 19 · React Compiler · Vite 7 · TypeScript · Tailwind CSS v4 · TanStack Query v5 · Redux Toolkit |
| **Infra** | Docker · Docker Compose (Dev/Prod) · GitHub Actions (CI) |
 
---
 
## Lighthouse Results (Production Mode)
 
The application is highly optimized for performance, accessibility, and SEO.
 
| Performance | Accessibility | Best Practices | SEO |
|-------------|---------------|----------------|-----|
| **97**      | **96**        | **96**         | **92** |
 
![Lighthouse Results](/Users/indumathivelan/Desktop/FUGA/docs/lighthouse-results.png)

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
- **App**: [http://localhost:5173](http://localhost:5173) (Dev) or [http://localhost:3000](http://localhost:3000) (Prod)
- **API Docs**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## CLI Commands (Makefile)

The project includes a `Makefile` for streamlined development and environment management.

### Environment Lifecycle
| Command | Description |
|---------|-------------|
| `make up` | Build and start all services (Docker) |
| `make down` | Stop all running services |
| `make logs` | Stream logs from all containers |
| `make clean` | Deep cleanup (Removes containers, volumes, and images) |

### Database Management
| Command | Description |
|---------|-------------|
| `make db-migrate-dev` | Run Prisma migrations (Development) |
| `make db-migrate` | Deploy Prisma migrations (Production) |
| `make db-seed` | Populate the catalog with 50 music products |

### Quality & Tests
| Command | Description |
|---------|-------------|
| `make test` | Run all backend and frontend unit tests |
| `make lint` | Run linting checks across the entire stack |

---

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
- **Rate Limiting**: Protection against DDoS and brute-force (1000 reqs/15m global, 100 reqs/15m for writes).
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

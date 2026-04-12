# FUGA – Music Product Management System

## Overview
FUGA is a high-performance music product management system designed for a modern, music-centric environment. The platform provides a seamless interface for managing digital music assets, featuring enterprise-grade performance and a secure authentication model where **catalogue browsing is public**, while all management actions are strictly protected via **Auth0 PKCE**.

## Project Description
FUGA is a purpose-built product management system tailored for music companies. The system enables seamless management of digital assets with a clear distinction between public discovery and secure administration:

- **Auth-Protected Management**: A secure interface for creating and updating products with metadata (Name, Artist Name) and cover art uploads. These actions, along with product deletion, require authentication via the **Auth0 PKCE flow**.
- **Dynamic Public Asset Library**: A high-performance viewing experience for the entire catalog, featuring optimized thumbnails and integrated product details accessible to all users without authentication.

---

## Technical Requirements Mapping

| Requirement | Implementation | Technical Highlights |
| :--- | :--- | :--- |
| **Create Product** | `ProductForm.tsx` with Title, Artist, and Image. | **Deferred S3 Uploads**: Files are only uploaded on form submit to prevent storage orphans. |
| **Product List** | `ProductGrid.tsx` with high-quality thumbnails. | **GIN Trigram Search**: Sub-millisecond fuzzy search on titles and artists via PostgreSQL. |
| **CRUD Operations** | Full REST API in `backend/src/modules/products`. | **Survival Mode**: Images survive product deletion as permanent Artist assets. |
| **Validation** | Zod schemas for all ingress data (API & DB). | **Type-Safe Pipelines**: Shared types across frontend/backend via Prisma. |
| **Image Upload** | Direct-to-S3 with Pre-signed URLs. | **Client-side Compression**: WebP conversion in-browser to save bandwidth. |
| **API Docs** | Interactive Swagger documentation. | **Preload Link Headers**: Backend-driven LCP image preloading for core performance. |

---

## 🚀 Key Features

### 1. Artist Image Library (New)
Artists now build a permanent gallery of their assets.
- **Asset Reuse**: Select from an artist's prior cover art when creating new products.
- **Survival Mode**: Deleting a product "detaches" it from the image but **never deletes** the physical file from S3, ensuring data integrity for shared assets.

### 2. High-Performance Discovery
- **Fuzzy Search**: Implemented `pg_trgm` GIN indexes for fast `ILIKE` searching.
- **Infinite Scroll**: Scroll-triggered pagination using React Query for smooth catalog browsing.
- **Zero Layout Shift (CLS)**: Image metadata (width/height) is extracted pre-upload and stored in the DB to reserve UI space instantly.

### 3. Enterprise Security
- **Auth0 PKCE**: Secure frontend authentication (Public discovery, Private management).
- **JWT Verification**: Strict backend validation of all state-changing requests.
- **Rate Limiting**: Global and write-specific limiters to prevent API abuse.

---

### Service (Backend - Node.js)
- **CRUD Operations**: Full Create, Read, Update, and Delete operations for managing products and artists.
- **API Endpoints**: RESTful API designed with Zod validation, comprehensive error handling, and security hardening.
- **Direct-to-Cloud Interoperability**: Generates secured AWS S3 Presigned URLs, offloading high-bandwidth file transfers entirely away from the Node.js event loop.
- **API Documentation**: Interactive documentation available via Swagger/OpenAPI.

### Client Application (Frontend - React)
- **UI for Product Creation**: User-friendly, accessible interface for entering product details and uploading cover art.
- **Product List Display**: High-performance grid interface with infinite scrolling, cover art thumbnails, and synchronized DB-to-UI product counts.
- **Custom Global Notifications**: Centralized toast notification system for instant feedback on all product actions (Create/Update/Delete).
- **Hybrid Search Engine**: Zero-latency UI feedback via local cache filtering combined with a background server search for deep catalog discovery.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js · Express · TypeScript · PostgreSQL · Prisma · Auth0 (JWT) · Zod · AWS SDK 3 |
| **Frontend** | React 19 · Redux Toolkit · Auth0 (PKCE) · Vite 7 · TypeScript · Tailwind CSS v4 · TanStack Query v5 |
| **Infra** | Docker · Docker Compose · GitHub Actions (CI/CD) |
 
---
 
## Lighthouse Results (Production Mode)
 
The application is highly optimized for performance, accessibility, and SEO.
 
| Performance | Accessibility | Best Practices | SEO |
|-------------|---------------|----------------|-----|
| **97**      | **96**        | **96**         | **92** |
 
![Lighthouse Results](./docs/lighthouse-results.png)

---

## Authentication Configuration

FUGA uses **Auth0 PKCE** for secure, enterprise-grade authentication.

### Industrialized Setup
- **Centralized Configuration**: All frontend Auth0 settings are securely managed and validated in `frontend/src/config/auth.ts`.
- **Custom AuthProvider**: A dedicated `AuthProvider` component handles seamless programmatic navigation (`onRedirectCallback`) and reliable session persistence via `localStorage`.
- **Backend JWT Verification**: The backend uses `express-oauth2-jwt-bearer` to automatically verify JWT signatures, audience, and issuer using Auth0's public keys.

### Required Environment Variables
Ensure your `.env` files contain the following Auth0 configuration:

**Frontend (`frontend/.env`)**
```bash
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.fuga.music
```

**Backend (`backend/.env`)**
```bash
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.fuga.music
```

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

## Project Structure

```
FUGA/
 ├─ backend/
 ├─ src/
 │   ├─ modules/
 │   │   ├─ products/  # Product CRUD & Search logic
 │   │   └─ artists/   # Artist Library lookup & Image Gallery
 │   ├─ middlewares/   # auth (Auth0 JWT) · rateLimiter · validate · errorHandler
 │   └─ lib/           # Storage service (S3) · Prisma client · Logger
 ├─ frontend/
 ├─ src/
 │   ├─ features/products/
 │   │   ├─ components/ # ArtistLibraryPicker · CoverArtUpload · ProductGrid
 │   │   ├─ hooks/      # useArtistLibrary · useProductForm · useInfiniteProducts
 │   │   └─ api.ts      # Products & Artists API clients
 │   ├─ store/          # Redux Toolkit (UI state management)
 │   └─ lib/            # apiClient (Interceptors for Auth tokens)
```

---

## API & Security

### Security Measures
- **Rate Limiting**: Protection against DDoS and brute-force (1000 reqs/15m global, 100 reqs/15m for writes).
- **Authentication**: **Auth0 PKCE & JWT Verification** required for all state-changing operations.
- **Hardened Headers**: Strict CSP, X-Frame-Options (Clickjacking protection), and HSTS.
- **Input Sanitization**: Global Zod validation middleware for all request payloads.

### Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/products` | ❌ | Paginated catalog with Search/Filter |
| `GET` | `/api/artists` | ❌ | Artist Library & Image Gallery lookup |
| `POST` | `/api/products` | ✅ | Create product (Deferred S3 upload) |
| `PUT` | `/api/products/:id` | ✅ | Update product (Asset persistence) |
| `DELETE` | `/api/products/:id` | ✅ | Delete product (Survival Mode) |

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Survival Mode (SetNull)**| Switched from Cascade Delete to SetNull on product images. This treats images as permanent Artist assets, allowing them to survive product deletion and be safely reused across the catalog without storage fragmentation or broken links. |
| **GIN Trigram Search**| Implemented PostgreSQL `pg_trgm` indexes. This solves the "Full Table Scan" limitation of standard B-Tree indexes when performing fuzzy searches (`ILIKE %term%`) on large datasets. |
| **Auth0 PKCE** | Industry-standard security for SPAs, eliminating the risk of hardcoded secrets and providing seamless OAuth2/OIDC integration. |
| **Infinite Scroll** | Eliminates pagination latency; uses scroll-triggered data fetching for a modern mobile-first UX. |
| **Optimistic Direct Uploads** | Client-side compression combined with S3 Presigned URLs shifts compute costs to the browser, eliminating the need for heavy Node.js memory buffers. |

---

### CI (GitHub Actions)
Fully automated CI pipeline on every push:
- **Linting & Type-checking**
- **Unit & Integration Testing**
- **Production Build Validation**
- **Docker Image Build Verification**


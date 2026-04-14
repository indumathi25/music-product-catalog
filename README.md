# FUGA – Music Product Management System

## Music Catalog Management

FUGA is a high-performance management system built for the modern music industry. It’s designed to handle digital music assets with a focus on **speed, security, and smart data reuse**.

The architecture follows a "Public Discovery, Private Management" model: browsing the catalog is lightning-fast and public, while the management features are protected behind a secure Auth0-powered administrative layer.

---

## Tech Stack

| Layer        | Technology        | Why we chose it                                                                                                          |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | React 19 + Vite 7 | Using the latest stable standard with **React Compiler** support for auto-memoization.                                   |
| **State**    | React Hook Form   | Industry standard for managing complex lifecycles (like asynchronous image uploads) with sub-millisecond input response. |
| **Server**   | Node.js + Express | Lightweight and highly scalable, perfect for an API-first asset manager.                                                 |
| **Database** | Postgre + Prisma  | Relational integrity for complex Artist ↔ Product ↔ Image mapping.                                                       |
| **Storage**  | AWS S3            | Dedicated object storage using **Presigned URLs** to offload high-bandwidth transfers from the server.                   |

---

## Architectural

### 1. The "Artist Library" & Data Integrity

In most systems, the catalog can become "polluted" with misspelled artist names (e.g., "The Beatles" vs "Beatles"). We implemented **Strict Artist Management**:
- **Curated Selection**: Users must select from a predefined list of artists, ensuring perfect data consistency across the platform.
- **Product Integrity**: We enforce a database-level `unique` constraint on the `[title, artist_id]` combination. This means an artist can never accidentally have two products with the exact same title.

### 2. Database Schema & Constraints

We use a highly optimized PostgreSQL schema managed via Prisma. The core architecture relies on **Composite Unique Keys** to enforce business rules at the database level:

- **Product Safety**: `@@unique([title, artist_id])` — prevents duplicate releases within an artist's catalog.
- **Image "Survival Mode"**: `@@unique([url, artist_id])` — ensures that each unique asset URL is correctly bound to an artist, allowing for smart reuse and preventing orphaned files.
- **Implicit Many-to-Many**: Products and Images are connected through an implicit join table (`_ImageToProduct`), enabling a single cover art to be linked to multiple product releases (Singles, Albums, Remixes) without duplicate storage.

### 3. Direct-to-Cloud Upload Pipeline

Instead of loading heavy binary files through the Node.js server (which blocks the event loop), we use **AWS S3 Presigned URLs**.

1. The frontend requests a secure, temporary "Permission Ticket" from the backend.
2. The browser uploads the file **directly to S3**.
3. Only the lightweight metadata (URL, dimensions, size) is sent back to our DB.
   _This makes the system infinitely scalable regardless of file size._

### 3. Sub-Millisecond Discovery

We didn't just add a search box; we optimized the indexing:

- **Fuzzy Search**: Implemented `pg_trgm` GIN indexes in PostgreSQL to handle typos and partial matches (e.g., searching "Beatls" still finds "The Beatles").
- **ZLS (Zero Layout Shift)**: We extract image dimensions _before_ upload and store them in the DB. The frontend uses these to reserve space instantly, preventing that annoying "jumpy" UI as images load.

---

## Security Model

We use **Auth0 PKCE** flows for the frontend and strict **JWT verification** for the backend.

- **Public Access**: All users can view the catalog and search for music.
- **Admin Access**: Only authenticated users can Create, Update, or Delete products.
- **Rate Limiting**: Integrated `express-rate-limit` to protect the Catalog and Management APIs from brute-force and DDoS attempts.

---

## Project Structure

```text
FUGA/
 ├─ backend/
 │   ├─ src/modules/products/  # High-performance CRUD & Search
 │   ├─ src/modules/artists/   # Asset deduplication & Library logic
 │   └─ src/lib/storage/       # S3 Presigned URL generator
 └─ frontend/
     ├─ features/products/
     │   ├─ hooks/             # useProductForm (RHF migration) · useArtistLibrary
     │   └─ components/        # Optimized UI components
     └─ lib/apiClient/         # Axios interceptors for Auth0 token injection
```

---

## Getting Started

The entire stack is containerized for a one-command setup.

```bash
# 1. Clone & Enter
git clone <repo-url> && cd FUGA

# 2. Setup Environment
cp .env.example .env

# 3. Launch
make up
```

**Access points:**

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Docs**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 📊 Lighthouse Results (Production Mode)

The application is highly optimized for performance, accessibility, and SEO.

| Performance | Accessibility | Best Practices | SEO    |
| ----------- | ------------- | -------------- | ------ |
| **97**      | **96**        | **96**         | **92** |

![Lighthouse Results](./docs/lighthouse-results.png)

- **Performance**: Preloaded LCP images, direct S3 streaming, and optimized bundle sizes.
- **Accessibility**: Full ARIA support, keyboard navigation, and semantic HTML5.
- **SEO**: Dynamic Meta descriptions, clean heading hierarchy, and unique ID structures.

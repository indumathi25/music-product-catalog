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

### 1. The "Artist Library" & Global Deduplication

In most systems, deleting a product deletes its image. We built **"Survival Mode."**
Images are treated as permanent Artist assets. When a product is deleted, the image persists in the Artist's library. This allows for:

- **Zero Storage Waste**: Reusing the same high-res cover art across multiple releases (Single, Album, Remix) without duplicate uploads.
- **Catalog Continuity**: Artists can maintain a history of their visual assets independent of their current active products.

### 2. Direct-to-Cloud Upload Pipeline

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

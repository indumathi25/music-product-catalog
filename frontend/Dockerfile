# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ── Stage 2: Production (nginx) ───────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Copy Vite build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config for SPA fallback + gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80 || exit 1

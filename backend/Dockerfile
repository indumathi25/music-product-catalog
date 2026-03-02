# ── Development stage 
FROM node:22-alpine AS dev

WORKDIR /app
RUN npm install -g npm@11.11.0
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "run", "dev"]

# ── Builder stage 
FROM node:22-alpine AS builder


WORKDIR /app
RUN npm install -g npm@11.11.0

COPY package*.json ./
RUN apk add --no-cache openssl libc6-compat
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app
RUN npm install -g npm@11.11.0

ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN apk add --no-cache openssl libc6-compat
RUN npm ci --omit=dev

# Copy compiled output and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY src ./src
COPY src/docs/openapi.yaml ./dist/src/docs/openapi.yaml

# Create uploads dir
RUN mkdir -p uploads && chown node:node uploads

# Run as non-root user
USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "dist/src/server.js"]

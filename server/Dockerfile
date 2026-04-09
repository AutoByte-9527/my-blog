FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY packages/shared ./packages/shared

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.pnpm/*/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Copy data directory for articles
COPY data ./data

EXPOSE 8000

CMD ["node", "dist/main.js"]

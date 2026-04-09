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

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies (rebuilds native modules)
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main.js"]

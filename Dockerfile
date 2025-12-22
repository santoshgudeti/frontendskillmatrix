# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl && rm -rf /var/cache/apk/*

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV npm_config_fetch_timeout=120000
ENV npm_config_fetch_retry_mintimeout=20000
ENV npm_config_fetch_retry_maxtimeout=120000
ENV npm_config_fetch_retries=10

# Dependencies stage - Install both dependencies and devDependencies for building
FROM base AS dependencies

# Copy package files
COPY package*.json ./

# Install all dependencies including devDependencies needed for build
RUN npm ci --include=dev && npm cache clean --force

# Build stage
FROM dependencies AS builder

# Copy source code
COPY . .

# Set build-time environment variables with defaults
ARG VITE_BACKEND_URL=http://localhost:5000
ARG VITE_APP_TITLE="SkillMatrix ATS"
ARG VITE_APP_DESCRIPTION="AI-Powered Applicant Tracking System"

# CRITICAL: Set environment variables for Vite build
# Vite bakes these into the bundle at BUILD TIME
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
ENV VITE_APP_DESCRIPTION=${VITE_APP_DESCRIPTION}

# Build the application (Vite will copy public/ to dist/ automatically)
RUN npm run build && \
    echo "Build complete. Checking dist contents:" && \
    ls -la dist/ && \
    echo "Checking for sitemap.xml:" && \
    ls -la dist/sitemap.xml || echo "WARNING: sitemap.xml not found!"

# Production stage - Serve with Vite Preview
FROM base AS production

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Copy package.json and node_modules (needed for vite preview)
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

WORKDIR /app

# Create non-root user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 3000

# Use Vite's preview server for production
# Preview server properly handles SPA routing and serves static files
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
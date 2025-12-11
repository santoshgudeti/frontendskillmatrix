# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

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

# Set build-time environment variables
ARG VITE_BACKEND_URL
ARG VITE_APP_TITLE
ARG VITE_APP_DESCRIPTION

# Set environment variables for build
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE:-"SkillMatrix ATS"}
ENV VITE_APP_DESCRIPTION=${VITE_APP_DESCRIPTION:-"AI-Powered Applicant Tracking System"}

# Build the application
RUN npm run build

# Production stage - Serve static files with Node.js
FROM base AS production

# Install serve globally to serve static files
RUN npm install -g serve

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Set working directory to dist folder
WORKDIR /app/dist

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /app/dist

# Switch to non-root user
USER appuser

# Health check using curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Serve the application
CMD ["serve", "-s", ".", "-l", "3000"]
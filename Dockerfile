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

# Dependencies stage
FROM base AS dependencies

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --frozen-lockfile && npm cache clean --force

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

# Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx user and set permissions
RUN addgroup -S nginx && adduser -S nginx -G nginx

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run/nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /var/run/nginx

# Switch to non-root user
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
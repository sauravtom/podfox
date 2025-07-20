# Use the official Node.js 20 image with Alpine Linux for smaller size
FROM node:20-alpine AS base

# Install system dependencies including ffmpeg for audio processing
RUN apk add --no-cache \
    ffmpeg \
    libc6-compat \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./
# Use --force to avoid issues with dependency resolution, then clean cache
RUN npm install --force && npm cache clean --force

# Development stage (caches dependencies)
FROM base AS deps
COPY package*.json ./
RUN npm install --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Build arguments from environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/sign-in
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/sign-up
ARG EXA_API_KEY
ARG OPENAI_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_REDIRECT_URI
ARG YOUTUBE_API_KEY
ARG WANDB_API_KEY

# Set up environment variables from build args for the build process
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
ENV EXA_API_KEY=${EXA_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
ENV YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
ENV WANDB_API_KEY=${WANDB_API_KEY}

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install ffmpeg in the final production image
RUN apk add --no-cache \
    ffmpeg \
    libc6-compat \
    && rm -rf /var/cache/apk/*

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application artifacts from the builder stage
# This leverages the standalone output mode of Next.js for a minimal image
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set runtime environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Pass build arguments to the runner stage
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ARG EXA_API_KEY
ARG OPENAI_API_KEY
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GOOGLE_REDIRECT_URI
ARG YOUTUBE_API_KEY
ARG WANDB_API_KEY

# Set up environment variables from args for the runtime
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
ENV EXA_API_KEY=${EXA_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
ENV YOUTUBE_API_KEY=${YOUTUBE_API_KEY}
ENV WANDB_API_KEY=${WANDB_API_KEY}

USER nextjs
EXPOSE 3000

# Health check to ensure the application is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application using the standalone server file
CMD ["node", "server.js"]
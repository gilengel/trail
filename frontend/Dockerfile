# Use Node.js as the base image
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

# Set working directory
WORKDIR /usr/src/app

# Build
FROM base as build

# Install dependencies
COPY --link package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY --link . .

# Expose the port Nuxt uses by default
EXPOSE 3000

# Start the development server with hot reload
CMD ["npm", "run", "dev"]

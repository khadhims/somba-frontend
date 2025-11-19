# Multi-stage Dockerfile

# Build stage: install deps and build the app
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies (use npm ci if package-lock.json exists)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Production stage: serve the built static files
FROM node:22-alpine AS production
WORKDIR /app

# Use a small static file server so we don't need dev deps at runtime
RUN npm i -g serve --silent

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Expose the port that `serve` will use (matches docker-compose mapping 5173:5173)
EXPOSE 5173

# Start serving the built app on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
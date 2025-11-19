# Development Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
RUN npm run build

COPY --from=build /app/dist ./dist
# Expose port
EXPOSE 8080

# Start development server
CMD ["npm", "run", "preview"]
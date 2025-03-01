# # ----------- STAGE 1: Build -----------
#     FROM node:18-alpine AS builder

#     # Set the working directory
#     WORKDIR /app
    
#     # Copy package.json and install dependencies
#     COPY package*.json ./
    
#     # Install all dependencies (including devDependencies for build)
#     RUN npm install
    
#     # Copy the rest of the application
#     COPY . .
    
#     # Ensure the `dist` directory exists and build the app
#     RUN npm run build && ls -la /app/dist
    
#     # ----------- STAGE 2: Deploy -----------
#     FROM node:18-alpine AS runner
    
#     # Set the working directory
#     WORKDIR /app
    
#     # Copy only necessary files from the builder stage
#     COPY --from=builder /app/package.json ./
#     COPY --from=builder /app/node_modules ./node_modules
#     COPY --from=builder /app/dist ./dist
    
#     # Set environment variables
#     ENV NODE_ENV=production
#     ENV PORT=3000
    
#     # Expose application port
#     EXPOSE 3000
    
#     # Start the application
#     CMD ["node", "dist/main"]
    

# Use an official Node.js image as the base
FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS app
RUN npm run build

# Use a minimal Node.js image for the final build
FROM node:18-slim

# Install MongoDB
RUN apt-get update && \
    apt-get install -y mongodb && \
    rm -rf /var/lib/apt/lists/*

# Create MongoDB data directory
RUN mkdir -p /data/db

# Set working directory for the app
WORKDIR /app

# Copy built files and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Environment variables for MongoDB
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=password
ENV MONGO_URI=mongodb://admin:password@localhost:27017/nest?authSource=admin
ENV NODE_ENV=production

# Expose necessary ports
EXPOSE 3000 27017

# Install a process manager to run multiple services
RUN npm install -g concurrently

# Command to run MongoDB and NestJS together
CMD concurrently --kill-others \
  "mongod --bind_ip_all --dbpath /data/db" \
  "node dist/main.js"

# ----------- STAGE 1: Build -----------
    FROM node:18-alpine AS builder

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and install dependencies
    COPY package*.json ./
    
    # Install all dependencies (including devDependencies for build)
    RUN npm install
    
    # Copy the rest of the application
    COPY . .
    
    # Ensure the `dist` directory exists and build the app
    RUN npm run build && ls -la /app/dist
    
    # ----------- STAGE 2: Deploy -----------
    FROM node:18-alpine AS runner
    
    # Set the working directory
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    
    # Set environment variables
    ENV NODE_ENV=production
    ENV PORT=3000
    
    # Expose application port
    EXPOSE 3000
    
    # Start the application
    CMD ["node", "dist/main"]
    
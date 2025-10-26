# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copy package files only to install dependencies and leverage caching
COPY package.json package-lock.json ./

# 2. Install ALL dependencies (dev and prod) for building
RUN npm install

# 3. Copy the rest of the source code
COPY . .

# 4. Run the build script
RUN npm run build
RUN rm -rf src/ tests/ tsconfig.json Dockerfile .dockerignore package.json package-lock.json .env 

# 5. --- Create a dedicated production node_modules layer ---
# Create a separate folder to install ONLY production dependencies
# This folder is what we'll copy to the final image
RUN npm prune --production

# ---
# Stage 2: Production
# Using alpine or slim-bullseye is a good alternative for even smaller images
FROM alpine:3.20 AS production

# Set environment variables
ENV NODE_ENV=production
WORKDIR /app

# 1. Copy the Node.js runtime executable from the builder's bin directory
# This saves the entire node:20-alpine base image size.
COPY --from=builder /usr/local/bin/node /usr/local/bin/
# Copy necessary shared libraries that Node.js depends on in Alpine
COPY --from=builder /lib/ld-musl*.so.1 /lib/
COPY --from=builder /usr/lib/libgcc* /usr/lib/
COPY --from=builder /usr/lib/libstdc++* /usr/lib/

# 2. Copy ONLY the pruned node_modules and built code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Optional: Copy package.json only if you need the 'npm run' command
# COPY package.json ./

EXPOSE 3001

# Run the app directly using the copied 'node' binary
CMD ["/usr/local/bin/node", "dist/app.js"]
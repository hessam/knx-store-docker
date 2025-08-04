# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    wget \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Install global dependencies
RUN npm install -g \
    typescript \
    ts-node \
    nodemon

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p src/pages src/components src/layouts src/lib src/styles

# Set environment variables
ENV NODE_ENV=development
ENV PORT=4001

# Expose ports
EXPOSE 4001 4002 4003 4004

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4001 || exit 1

# Default command
CMD ["npm", "run", "dev"]

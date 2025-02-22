# Use an official Node.js runtime with Bun
FROM oven/bun:1.1.6-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install necessary dependencies including PostgreSQL client
RUN apk add --no-cache \
    libc6-compat \
    build-base \
    postgresql-client

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Create migrations directory
RUN mkdir -p migrations

# Generate Drizzle migrations
RUN bun run db:generate

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 8000

# Set Node to use ES modules
ENV NODE_OPTIONS="--experimental-specifier-resolution=node --no-warnings"

# Start the application
CMD ["bun", "start"]

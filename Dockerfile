# Use an official Bun runtime
FROM oven/bun:1.1.6-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install necessary dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-client \
    libstdc++6

# Copy package files first for better layer caching
COPY package.json bun.lockb ./

# Install dependencies using Bun
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 8000

# Run the app
CMD ["bun", "run", "start"]
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build the NestJS application
RUN npm run build

# Verify the build output
RUN ls -la dist/src/
RUN ls -la dist/src/main.js

# Keep dev dependencies for ts-node (needed for seed)
# Don't prune dev dependencies as ts-node is needed for seeding

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
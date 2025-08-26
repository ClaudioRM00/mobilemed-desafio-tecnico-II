FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

# Build the NestJS application and then remove dev dependencies to slim final image
RUN npm run build
# optional sanity print
RUN ls -R dist | head

# Prune dev dependencies
RUN npm prune --omit=dev

# Expose application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
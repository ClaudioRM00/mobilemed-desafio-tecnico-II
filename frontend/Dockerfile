# Stage 1: build the Angular application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies including dev ones (Angular CLI is required for build)
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve the application with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
# Copy a basic nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
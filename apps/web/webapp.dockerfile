# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy configuration files
COPY tsconfig.base.json tsconfig.json ./

# Build the Angular app
COPY . .
RUN npm run build -- web

# Production image
FROM nginx:alpine AS runner

# Copy nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder
COPY --from=builder /app/dist/apps/web/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
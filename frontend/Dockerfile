# ============================================================
# Stage 1 – Build React app
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .

# Point API calls to /api (handled by Nginx proxy)
ENV REACT_APP_API_URL=/api

RUN npm run build

# ============================================================
# Stage 2 – Serve with Nginx on port 3000
# ============================================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config that serves on 3000
COPY nginx.frontend.conf /etc/nginx/conf.d/frontend.conf

# Copy built React assets
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

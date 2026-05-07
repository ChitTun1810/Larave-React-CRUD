# ============================================================
# Stage 1 – Composer dependencies
#   Use the same base image as runtime to avoid PHP platform
#   mismatch errors between composer image and app image.
# ============================================================
FROM dunglas/frankenphp:1-php8.4-alpine AS vendor

# Install composer into this stage
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs

# ============================================================
# Stage 2 – FrankenPHP runtime
# ============================================================
FROM dunglas/frankenphp:1-php8.4-alpine AS app

# Install required PHP extensions for Laravel
RUN install-php-extensions \
    pdo_mysql \
    opcache \
    pcntl \
    bcmath \
    intl \
    zip

WORKDIR /app

# Copy vendor from stage 1
COPY --from=vendor /app/vendor ./vendor

# Copy application source
COPY . .

# Set correct storage & cache permissions
RUN mkdir -p storage/logs \
             storage/framework/cache \
             storage/framework/sessions \
             storage/framework/views \
             bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Use Docker-specific .env (DB_HOST=db instead of 127.0.0.1)
COPY .env.docker .env

# Override the default Caddyfile with our HTTP-only config
COPY Caddyfile /etc/caddy/Caddyfile

# FrankenPHP listens on 8080 (HTTP only, no TLS)
ENV SERVER_NAME=":8080"

EXPOSE 8080

CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]

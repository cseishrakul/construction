# Use the official PHP 8.1 FPM image
FROM php:8.1-fpm

# Install system dependencies and required PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath gd xml

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies (skip scripts because .env is not available yet)
RUN composer install --optimize-autoloader --no-dev --no-scripts

# Copy the rest of the application
COPY . .

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port
EXPOSE 8080

# At runtime, now that .env exists, run artisan scripts
CMD php artisan config:clear && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=8080

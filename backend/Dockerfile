# Use official PHP 8.1 FPM image
FROM php:8.1-fpm

# Install system dependencies and PHP extensions needed by Laravel
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    zip \
    curl \
    && docker-php-ext-install pdo_mysql zip mbstring exif pcntl bcmath gd xml

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory inside the container
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies without dev packages and optimize autoloader
RUN composer install --optimize-autoloader --no-dev

# Copy the rest of the application files
COPY . .

# Cache the Laravel config (optional but recommended)
RUN php artisan config:cache

# Fix permissions for Laravel storage and cache folders
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port 8080 (the port Laravel’s built-in server will run on)
EXPOSE 8080

# Start Laravel’s built-in development server on container start
CMD php artisan serve --host=0.0.0.0 --port=8080

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

# Copy composer files for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies without dev packages
RUN composer install --optimize-autoloader --no-dev

# Copy the rest of the application files
COPY . .

# Set correct permissions for storage and cache folders
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port Laravel will run on
EXPOSE 8080

# Start Laravel server and cache config at runtime
CMD php artisan config:cache && php artisan serve --host=0.0.0.0 --port=8080

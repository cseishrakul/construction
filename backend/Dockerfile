FROM php:8.2.12-fpm
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
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-dev --no-scripts -vvv
COPY . .
RUN chown -R www-data:www-data storage bootstrap/cache
EXPOSE 8080
CMD php artisan config:clear && php artisan config:cache && php artisan serve --host=0.0.0.0 --port=8080

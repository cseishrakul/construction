<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('services');
    }

    public function down(): void
    {
        Schema::create('services', function ($table) {
            $table->id();
            $table->timestamps();
        });
    }
};

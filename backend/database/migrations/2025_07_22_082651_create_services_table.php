<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_desc')->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->string('image_public_id')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('details')->nullable();
            $table->string('budget')->nullable();
            $table->string('timeline')->nullable();
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};

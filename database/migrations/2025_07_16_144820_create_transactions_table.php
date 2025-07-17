<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('balance_id');
            $table->enum('type',['income','expense']); 
            $table->decimal('amount', 10, 2);
            $table->string('category'); // e.g., 'food', 'transport', '
            $table->string('description')->nullable();
            $table->date('date'); // Transaction date
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

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
        Schema::create('biometric_logs', function (Blueprint $table) {
            $table->id();
            $table->morphs('loggable');
            $table->string('cnic', 13);
            $table->string('transaction_id');
            $table->enum('verification_status', ['success', 'failed']);
            $table->json('response_data')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index('cnic');
            $table->index('transaction_id');
            $table->index('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biometric_logs');
    }
};

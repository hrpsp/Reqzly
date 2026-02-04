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
        Schema::create('credit_card_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->string('customer_name');
            $table->string('customer_cnic', 13);
            $table->string('credit_card_number');
            $table->string('contact_no');
            $table->string('email')->nullable();
            $table->enum('request_type', [
                'address_change',
                'balance_confirmation',
                'estatement_enrolment',
                'estatement_cancellation',
                'card_cancellation',
                'card_replacement',
                'refund_excess',
                'wrongly_deposited',
                'noc_letter',
                'mailing_address_change',
                'duplicate_statement',
                'reversal_charges',
                'card_unblocking',
                'redelivery_card',
                'limit_enhancement',
                'contact_change',
                'ccp_enrolment',
                'ccp_cancellation',
                'other',
            ]);
            $table->text('other_request_details')->nullable();
            $table->text('details')->nullable();
            $table->boolean('biometric_verified')->default(false);
            $table->string('biometric_transaction_id')->nullable();
            $table->timestamp('biometric_verified_at')->nullable();
            $table->enum('status', ['pending', 'verified', 'completed', 'cancelled'])->default('pending');
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('customer_cnic');
            $table->index('status');
            $table->index('request_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_card_requests');
    }
};

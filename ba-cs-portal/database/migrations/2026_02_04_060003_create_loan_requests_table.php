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
        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->enum('loan_type', ['auto_loan', 'personal_loan', 'home_loan']);
            $table->string('customer_name');
            $table->string('customer_cnic', 13);
            $table->string('loan_account_number');
            $table->string('contact_no');
            $table->enum('request_type', [
                'loan_settlement',
                'payoff_sheet',
                'partial_payment',
                'noc_issuance',
                'insurance_claim',
                'release_documents',
                'refund_excess',
                'adjustment_excess',
                'demographics_change',
                'payment_mode_change',
                'insurance_policy',
                'copy_documents',
                'pay_order_collection',
                'amortization_schedule',
                'verification_documents',
                'waiver_charges',
                'tax_certificate',
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
            $table->index('loan_type');
            $table->index('request_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_requests');
    }
};

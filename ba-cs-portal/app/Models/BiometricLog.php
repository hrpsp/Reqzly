<?php

namespace App\Models;

use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class BiometricLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'loggable_type',
        'loggable_id',
        'cnic',
        'transaction_id',
        'verification_status',
        'response_data',
        'verified_at',
        'created_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verification_status' => VerificationStatus::class,
            'response_data' => 'array',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the parent loggable model (CreditCardRequest or LoanRequest).
     */
    public function loggable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who created the log.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include successful verifications.
     */
    public function scopeSuccessful($query)
    {
        return $query->where('verification_status', VerificationStatus::SUCCESS);
    }

    /**
     * Scope a query to only include failed verifications.
     */
    public function scopeFailed($query)
    {
        return $query->where('verification_status', VerificationStatus::FAILED);
    }

    /**
     * Check if the verification was successful.
     */
    public function isSuccessful(): bool
    {
        return $this->verification_status === VerificationStatus::SUCCESS;
    }

    /**
     * Check if the verification failed.
     */
    public function isFailed(): bool
    {
        return $this->verification_status === VerificationStatus::FAILED;
    }
}

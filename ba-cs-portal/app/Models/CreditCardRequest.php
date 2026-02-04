<?php

namespace App\Models;

use App\Enums\CreditCardRequestType;
use App\Enums\RequestStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditCardRequest extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'request_number',
        'customer_name',
        'customer_cnic',
        'credit_card_number',
        'contact_no',
        'email',
        'request_type',
        'other_request_details',
        'details',
        'biometric_verified',
        'biometric_transaction_id',
        'biometric_verified_at',
        'status',
        'branch_id',
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
            'request_type' => CreditCardRequestType::class,
            'status' => RequestStatus::class,
            'biometric_verified' => 'boolean',
            'biometric_verified_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->request_number)) {
                $model->request_number = self::generateRequestNumber();
            }
        });
    }

    /**
     * Generate a unique request number.
     */
    public static function generateRequestNumber(): string
    {
        $date = now()->format('Ymd');
        $lastRequest = self::withTrashed()
            ->whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastRequest
            ? (int) substr($lastRequest->request_number, -4) + 1
            : 1;

        return sprintf('CC-%s-%04d', $date, $sequence);
    }

    /**
     * Get the branch that owns the request.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the user who created the request.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the biometric logs for the request.
     */
    public function biometricLogs(): MorphMany
    {
        return $this->morphMany(BiometricLog::class, 'loggable');
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', RequestStatus::PENDING);
    }

    /**
     * Scope a query to only include verified requests.
     */
    public function scopeVerified($query)
    {
        return $query->where('status', RequestStatus::VERIFIED);
    }

    /**
     * Scope a query to only include completed requests.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', RequestStatus::COMPLETED);
    }

    /**
     * Mark the request as verified.
     */
    public function markAsVerified(string $transactionId): void
    {
        $this->update([
            'biometric_verified' => true,
            'biometric_transaction_id' => $transactionId,
            'biometric_verified_at' => now(),
            'status' => RequestStatus::VERIFIED,
        ]);
    }

    /**
     * Mark the request as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update(['status' => RequestStatus::COMPLETED]);
    }

    /**
     * Mark the request as cancelled.
     */
    public function markAsCancelled(): void
    {
        $this->update(['status' => RequestStatus::CANCELLED]);
    }
}

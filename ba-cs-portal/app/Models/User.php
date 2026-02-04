<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_code',
        'employee_name',
        'designation',
        'department',
        'reports_to',
        'region',
        'mobile_number',
        'email',
        'password',
        'role',
        'picture',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the supervisor that this user reports to.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reports_to');
    }

    /**
     * Get the subordinates that report to this user.
     */
    public function subordinates(): HasMany
    {
        return $this->hasMany(User::class, 'reports_to');
    }

    /**
     * Get the credit card requests created by this user.
     */
    public function creditCardRequests(): HasMany
    {
        return $this->hasMany(CreditCardRequest::class, 'created_by');
    }

    /**
     * Get the loan requests created by this user.
     */
    public function loanRequests(): HasMany
    {
        return $this->hasMany(LoanRequest::class, 'created_by');
    }

    /**
     * Get the biometric logs created by this user.
     */
    public function biometricLogs(): HasMany
    {
        return $this->hasMany(BiometricLog::class, 'created_by');
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    /**
     * Check if the user is a supervisor.
     */
    public function isSupervisor(): bool
    {
        return $this->role === UserRole::SUPERVISOR;
    }

    /**
     * Check if the user is a staff member.
     */
    public function isStaff(): bool
    {
        return $this->role === UserRole::STAFF;
    }
}

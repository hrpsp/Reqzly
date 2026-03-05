<?php

namespace App\Services;

use App\Enums\RequestStatus;
use App\Models\CreditCardRequest;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class CreditCardRequestService
{
    /**
     * Get paginated list of credit card requests with filters.
     *
     * @param User $user
     * @param array<string, mixed> $filters
     * @return LengthAwarePaginator
     */
    public function getList(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = CreditCardRequest::with(['branch', 'creator']);

        // Staff users can only see their own requests
        if ($user->isStaff()) {
            $query->where('created_by', $user->id);
        }

        // Apply filters
        $this->applyFilters($query, $filters);

        // Apply search
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_cnic', 'like', "%{$search}%")
                    ->orWhere('credit_card_number', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    /**
     * Get all requests for export.
     *
     * @param User $user
     * @param array<string, mixed> $filters
     * @return Collection
     */
    public function getForExport(User $user, array $filters = []): Collection
    {
        $query = CreditCardRequest::with(['branch', 'creator']);

        // Staff users can only see their own requests
        if ($user->isStaff()) {
            $query->where('created_by', $user->id);
        }

        // Apply filters
        $this->applyFilters($query, $filters);

        // Apply search
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_cnic', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new credit card request.
     *
     * @param User $user
     * @param array<string, mixed> $data
     * @return CreditCardRequest
     */
    public function create(User $user, array $data): CreditCardRequest
    {
        $data['created_by'] = $user->id;
        $data['status'] = RequestStatus::PENDING;

        // Auto-assign branch from user's first credit card request or use default
        if (empty($data['branch_id'])) {
            $data['branch_id'] = $this->getBranchForUser($user);
        }

        return CreditCardRequest::create($data);
    }

    /**
     * Update an existing credit card request.
     *
     * @param CreditCardRequest $request
     * @param array<string, mixed> $data
     * @return CreditCardRequest
     */
    public function update(CreditCardRequest $request, array $data): CreditCardRequest
    {
        // Don't allow updates to completed or cancelled requests
        if (in_array($request->status, [RequestStatus::COMPLETED, RequestStatus::CANCELLED])) {
            throw new \InvalidArgumentException('Cannot update a completed or cancelled request.');
        }

        $request->update($data);

        return $request->fresh(['branch', 'creator']);
    }

    /**
     * Soft delete a credit card request.
     *
     * @param CreditCardRequest $request
     * @return bool
     */
    public function delete(CreditCardRequest $request): bool
    {
        return $request->delete();
    }

    /**
     * Get a single credit card request with relations.
     *
     * @param int $id
     * @param User $user
     * @return CreditCardRequest|null
     */
    public function find(int $id, User $user): ?CreditCardRequest
    {
        $query = CreditCardRequest::with(['branch', 'creator', 'biometricLogs']);

        // Staff users can only see their own requests
        if ($user->isStaff()) {
            $query->where('created_by', $user->id);
        }

        return $query->find($id);
    }

    /**
     * Apply filters to the query.
     *
     * @param Builder $query
     * @param array<string, mixed> $filters
     * @return void
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        // Status filter
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Request type filter
        if (!empty($filters['request_type'])) {
            $query->where('request_type', $filters['request_type']);
        }

        // Date range filter
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Branch filter (admin/supervisor only)
        if (!empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        // Biometric verified filter
        if (isset($filters['biometric_verified'])) {
            $query->where('biometric_verified', filter_var($filters['biometric_verified'], FILTER_VALIDATE_BOOLEAN));
        }
    }

    /**
     * Get branch ID for user.
     *
     * @param User $user
     * @return int|null
     */
    private function getBranchForUser(User $user): ?int
    {
        // Try to get branch from user's previous requests
        $previousRequest = CreditCardRequest::where('created_by', $user->id)
            ->whereNotNull('branch_id')
            ->latest()
            ->first();

        if ($previousRequest) {
            return $previousRequest->branch_id;
        }

        // Default to first branch if no previous requests
        return \App\Models\Branch::first()?->id;
    }
}

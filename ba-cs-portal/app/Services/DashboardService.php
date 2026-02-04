<?php

namespace App\Services;

use App\Enums\RequestStatus;
use App\Models\CreditCardRequest;
use App\Models\LoanRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get dashboard statistics for the given user.
     *
     * @param User $user
     * @return array<string, mixed>
     */
    public function getStats(User $user): array
    {
        $isStaff = $user->isStaff();

        return [
            'today_requests' => $this->getTodayRequestsCount($user, $isStaff),
            'pending_verifications' => $this->getPendingVerificationsCount($user, $isStaff),
            'completed_today' => $this->getCompletedTodayCount($user, $isStaff),
            'monthly_total' => $this->getMonthlyTotalCount($user, $isStaff),
            'credit_card_stats' => $this->getCreditCardStats($user, $isStaff),
            'loan_stats' => $this->getLoanStats($user, $isStaff),
        ];
    }

    /**
     * Get recent activity (last 10 requests).
     *
     * @param User $user
     * @return array<int, array<string, mixed>>
     */
    public function getRecentActivity(User $user): array
    {
        $isStaff = $user->isStaff();

        // Get credit card requests
        $creditCardQuery = CreditCardRequest::select([
            'id',
            'request_number',
            DB::raw("'credit_card' as type"),
            'customer_name',
            'status',
            'created_at',
        ]);

        if ($isStaff) {
            $creditCardQuery->where('created_by', $user->id);
        }

        // Get loan requests
        $loanQuery = LoanRequest::select([
            'id',
            'request_number',
            DB::raw("'loan' as type"),
            'customer_name',
            'status',
            'created_at',
        ]);

        if ($isStaff) {
            $loanQuery->where('created_by', $user->id);
        }

        // Union and order by date
        $recentRequests = $creditCardQuery
            ->union($loanQuery)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return $recentRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'request_number' => $request->request_number,
                'type' => $request->type,
                'type_label' => $request->type === 'credit_card' ? 'Credit Card' : 'Loan',
                'customer_name' => $request->customer_name,
                'status' => $request->status->value,
                'status_label' => $request->status->label(),
                'status_color' => $request->status->color(),
                'created_at' => $request->created_at->toIso8601String(),
                'created_at_human' => $request->created_at->diffForHumans(),
            ];
        })->toArray();
    }

    /**
     * Get today's total requests count.
     */
    private function getTodayRequestsCount(User $user, bool $isStaff): int
    {
        $creditCardCount = $this->buildQuery(CreditCardRequest::query(), $user, $isStaff)
            ->whereDate('created_at', today())
            ->count();

        $loanCount = $this->buildQuery(LoanRequest::query(), $user, $isStaff)
            ->whereDate('created_at', today())
            ->count();

        return $creditCardCount + $loanCount;
    }

    /**
     * Get pending verifications count (pending status).
     */
    private function getPendingVerificationsCount(User $user, bool $isStaff): int
    {
        $creditCardCount = $this->buildQuery(CreditCardRequest::query(), $user, $isStaff)
            ->where('status', RequestStatus::PENDING)
            ->count();

        $loanCount = $this->buildQuery(LoanRequest::query(), $user, $isStaff)
            ->where('status', RequestStatus::PENDING)
            ->count();

        return $creditCardCount + $loanCount;
    }

    /**
     * Get completed today count.
     */
    private function getCompletedTodayCount(User $user, bool $isStaff): int
    {
        $creditCardCount = $this->buildQuery(CreditCardRequest::query(), $user, $isStaff)
            ->where('status', RequestStatus::COMPLETED)
            ->whereDate('updated_at', today())
            ->count();

        $loanCount = $this->buildQuery(LoanRequest::query(), $user, $isStaff)
            ->where('status', RequestStatus::COMPLETED)
            ->whereDate('updated_at', today())
            ->count();

        return $creditCardCount + $loanCount;
    }

    /**
     * Get monthly total count.
     */
    private function getMonthlyTotalCount(User $user, bool $isStaff): int
    {
        $creditCardCount = $this->buildQuery(CreditCardRequest::query(), $user, $isStaff)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $loanCount = $this->buildQuery(LoanRequest::query(), $user, $isStaff)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return $creditCardCount + $loanCount;
    }

    /**
     * Get credit card specific stats.
     */
    private function getCreditCardStats(User $user, bool $isStaff): array
    {
        $query = $this->buildQuery(CreditCardRequest::query(), $user, $isStaff);

        return [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('status', RequestStatus::PENDING)->count(),
            'verified' => (clone $query)->where('status', RequestStatus::VERIFIED)->count(),
            'completed' => (clone $query)->where('status', RequestStatus::COMPLETED)->count(),
            'today' => (clone $query)->whereDate('created_at', today())->count(),
        ];
    }

    /**
     * Get loan specific stats.
     */
    private function getLoanStats(User $user, bool $isStaff): array
    {
        $query = $this->buildQuery(LoanRequest::query(), $user, $isStaff);

        return [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('status', RequestStatus::PENDING)->count(),
            'verified' => (clone $query)->where('status', RequestStatus::VERIFIED)->count(),
            'completed' => (clone $query)->where('status', RequestStatus::COMPLETED)->count(),
            'today' => (clone $query)->whereDate('created_at', today())->count(),
        ];
    }

    /**
     * Build query with user filtering.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param User $user
     * @param bool $isStaff
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function buildQuery($query, User $user, bool $isStaff)
    {
        if ($isStaff) {
            $query->where('created_by', $user->id);
        }

        return $query;
    }
}

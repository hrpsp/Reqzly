<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Get dashboard statistics and recent activity.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $stats = $this->dashboardService->getStats($user);
        $recentActivity = $this->dashboardService->getRecentActivity($user);

        return $this->success([
            'stats' => $stats,
            'recent_activity' => $recentActivity,
        ], 'Dashboard data retrieved successfully');
    }
}

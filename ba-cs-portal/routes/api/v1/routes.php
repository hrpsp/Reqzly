<?php

use App\Http\Controllers\Api\V1\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
|
| Here you can register all API routes for version 1. These routes are
| loaded by the api.php file and will be prefixed with 'api/v1'.
|
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'version' => 'v1',
    ]);
});

// Authentication routes
require __DIR__.'/auth.php';

// Admin only routes
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Admin routes will be added here
});

// Supervisor and Admin routes
Route::middleware(['auth:sanctum', 'role:admin,supervisor'])->prefix('management')->group(function () {
    // Management routes will be added here
});

// All authenticated users routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});

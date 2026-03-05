<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCreditCardRequestRequest;
use App\Http\Requests\UpdateCreditCardRequestRequest;
use App\Http\Resources\CreditCardRequestResource;
use App\Models\CreditCardRequest;
use App\Services\CreditCardRequestService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CreditCardRequestController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CreditCardRequestService $service
    ) {}

    /**
     * List credit card requests with pagination, search, and filters.
     *
     * GET /api/v1/credit-card-requests
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search',
            'status',
            'request_type',
            'date_from',
            'date_to',
            'branch_id',
            'biometric_verified',
            'sort_by',
            'sort_direction',
            'per_page',
        ]);

        $paginated = $this->service->getList($request->user(), $filters);

        return $this->success(
            array_merge(
                ['data' => CreditCardRequestResource::collection($paginated)->resolve()],
                [
                    'meta' => [
                        'current_page' => $paginated->currentPage(),
                        'last_page'    => $paginated->lastPage(),
                        'per_page'     => $paginated->perPage(),
                        'total'        => $paginated->total(),
                        'from'         => $paginated->firstItem(),
                        'to'           => $paginated->lastItem(),
                    ],
                    'links' => [
                        'first' => $paginated->url(1),
                        'last'  => $paginated->url($paginated->lastPage()),
                        'prev'  => $paginated->previousPageUrl(),
                        'next'  => $paginated->nextPageUrl(),
                    ],
                ]
            ),
            'Credit card requests retrieved successfully'
        );
    }

    /**
     * Create a new credit card request.
     *
     * POST /api/v1/credit-card-requests
     */
    public function store(StoreCreditCardRequestRequest $request): JsonResponse
    {
        $creditCardRequest = $this->service->create(
            $request->user(),
            $request->validated()
        );

        // Reload with relations
        $creditCardRequest->load(['branch', 'creator']);

        return $this->created(
            new CreditCardRequestResource($creditCardRequest),
            'Credit card request created successfully'
        );
    }

    /**
     * Get a single credit card request.
     *
     * GET /api/v1/credit-card-requests/{id}
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $creditCardRequest = $this->service->find($id, $request->user());

        if (!$creditCardRequest) {
            return $this->notFound('Credit card request not found');
        }

        return $this->success(
            new CreditCardRequestResource($creditCardRequest),
            'Credit card request retrieved successfully'
        );
    }

    /**
     * Update an existing credit card request.
     *
     * PUT /api/v1/credit-card-requests/{id}
     */
    public function update(UpdateCreditCardRequestRequest $request, int $id): JsonResponse
    {
        $creditCardRequest = $this->service->find($id, $request->user());

        if (!$creditCardRequest) {
            return $this->notFound('Credit card request not found');
        }

        // Staff can only edit their own requests
        if ($request->user()->isStaff() && $creditCardRequest->created_by !== $request->user()->id) {
            return $this->forbidden('You are not allowed to update this request');
        }

        try {
            $updated = $this->service->update($creditCardRequest, $request->validated());
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }

        return $this->success(
            new CreditCardRequestResource($updated),
            'Credit card request updated successfully'
        );
    }

    /**
     * Soft delete a credit card request (admin only).
     *
     * DELETE /api/v1/credit-card-requests/{id}
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        // Only admins can delete
        if (!$request->user()->isAdmin()) {
            return $this->forbidden('Only administrators can delete requests');
        }

        $creditCardRequest = CreditCardRequest::find($id);

        if (!$creditCardRequest) {
            return $this->notFound('Credit card request not found');
        }

        $this->service->delete($creditCardRequest);

        return $this->success(null, 'Credit card request deleted successfully');
    }

    /**
     * Export credit card requests to CSV.
     *
     * GET /api/v1/credit-card-requests/export
     */
    public function export(Request $request): StreamedResponse
    {
        $filters = $request->only([
            'search',
            'status',
            'request_type',
            'date_from',
            'date_to',
            'branch_id',
        ]);

        $requests = $this->service->getForExport($request->user(), $filters);

        $filename = 'credit-card-requests-' . now()->format('Ymd-His') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
            'Expires'             => '0',
        ];

        $columns = [
            'Request #',
            'Customer Name',
            'CNIC',
            'Credit Card Number',
            'Contact No',
            'Email',
            'Request Type',
            'Status',
            'Branch',
            'Created By',
            'Biometric Verified',
            'Details',
            'Created At',
        ];

        $callback = function () use ($requests, $columns) {
            $file = fopen('php://output', 'w');

            // BOM for Excel UTF-8 compatibility
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header row
            fputcsv($file, $columns);

            // Data rows
            foreach ($requests as $req) {
                fputcsv($file, [
                    $req->request_number,
                    $req->customer_name,
                    $req->customer_cnic,
                    $req->credit_card_number,
                    $req->contact_no,
                    $req->email ?? '',
                    $req->request_type?->label() ?? '',
                    $req->status?->label() ?? '',
                    $req->branch?->branch_name ?? '',
                    $req->creator?->employee_name ?? '',
                    $req->biometric_verified ? 'Yes' : 'No',
                    $req->details ?? '',
                    $req->created_at->format('Y-m-d H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, Response::HTTP_OK, $headers);
    }
}

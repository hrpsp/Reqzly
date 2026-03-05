<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreditCardRequestResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'request_number'         => $this->request_number,

            // Customer info
            'customer_name'          => $this->customer_name,
            'customer_cnic'          => $this->customer_cnic,
            'credit_card_number'     => $this->credit_card_number,
            'contact_no'             => $this->contact_no,
            'email'                  => $this->email,

            // Request details
            'request_type'           => $this->request_type?->value,
            'request_type_label'     => $this->request_type?->label(),
            'other_request_details'  => $this->other_request_details,
            'details'                => $this->details,

            // Biometric
            'biometric_verified'     => $this->biometric_verified,
            'biometric_transaction_id' => $this->biometric_transaction_id,
            'biometric_verified_at'  => $this->biometric_verified_at?->toIso8601String(),

            // Status
            'status'                 => $this->status?->value,
            'status_label'           => $this->status?->label(),
            'status_color'           => $this->status?->color(),

            // Branch
            'branch_id'              => $this->branch_id,
            'branch'                 => $this->whenLoaded('branch', fn () => [
                'id'          => $this->branch->id,
                'branch_code' => $this->branch->branch_code,
                'branch_name' => $this->branch->branch_name,
                'city'        => $this->branch->city,
            ]),

            // Creator
            'created_by'             => $this->created_by,
            'creator'                => $this->whenLoaded('creator', fn () => [
                'id'            => $this->creator->id,
                'employee_code' => $this->creator->employee_code,
                'employee_name' => $this->creator->employee_name,
                'designation'   => $this->creator->designation,
            ]),

            // Biometric logs
            'biometric_logs'         => $this->whenLoaded('biometricLogs', fn () =>
                $this->biometricLogs->map(fn ($log) => [
                    'id'             => $log->id,
                    'status'         => $log->status?->value,
                    'status_label'   => $log->status?->label(),
                    'transaction_id' => $log->transaction_id,
                    'response_data'  => $log->response_data,
                    'created_at'     => $log->created_at->toIso8601String(),
                ])
            ),

            // Timestamps
            'created_at'             => $this->created_at->toIso8601String(),
            'updated_at'             => $this->updated_at->toIso8601String(),
            'created_at_human'       => $this->created_at->diffForHumans(),
        ];
    }
}

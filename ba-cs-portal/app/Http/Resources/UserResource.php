<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_code' => $this->employee_code,
            'employee_name' => $this->employee_name,
            'designation' => $this->designation,
            'department' => $this->department,
            'region' => $this->region,
            'mobile_number' => $this->mobile_number,
            'email' => $this->email,
            'role' => $this->role,
            'role_label' => $this->role->label(),
            'picture' => $this->picture ? $this->getPictureUrl() : null,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'supervisor' => $this->when($this->reports_to, function () {
                return [
                    'id' => $this->supervisor->id,
                    'employee_code' => $this->supervisor->employee_code,
                    'employee_name' => $this->supervisor->employee_name,
                    'designation' => $this->supervisor->designation,
                    'email' => $this->supervisor->email,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get the full URL for the profile picture.
     */
    protected function getPictureUrl(): string
    {
        if (str_starts_with($this->picture, 'http')) {
            return $this->picture;
        }

        return Storage::url($this->picture);
    }
}

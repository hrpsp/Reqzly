<?php

namespace App\Http\Requests;

use App\Enums\CreditCardRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCreditCardRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_name'       => ['required', 'string', 'max:255'],
            'customer_cnic'       => ['required', 'digits:13'],
            'credit_card_number'  => ['required', 'string', 'max:50'],
            'contact_no'          => ['required', 'string', 'max:20'],
            'email'               => ['nullable', 'email', 'max:255'],
            'request_type'        => ['required', new Enum(CreditCardRequestType::class)],
            'other_request_details' => ['nullable', 'string', 'max:1000', 'required_if:request_type,other'],
            'details'             => ['nullable', 'string', 'max:5000'],
            'branch_id'           => ['nullable', 'integer', 'exists:branches,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_cnic.digits'               => 'CNIC must be exactly 13 digits (without dashes).',
            'request_type.Illuminate\Validation\Rules\Enum' => 'Invalid request type selected.',
            'other_request_details.required_if'  => 'Please describe your request when selecting "Other".',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'customer_name'      => 'customer name',
            'customer_cnic'      => 'CNIC',
            'credit_card_number' => 'credit card number',
            'contact_no'         => 'contact number',
            'request_type'       => 'request type',
        ];
    }
}

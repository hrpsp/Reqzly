import type { RequestStatus } from './api';

// ────────────────────────────────────────────────────────────
// Enums (mirror Laravel CreditCardRequestType enum values)
// ────────────────────────────────────────────────────────────
export type CreditCardRequestType =
  | 'address_change'
  | 'balance_confirmation'
  | 'estatement_enrolment'
  | 'estatement_cancellation'
  | 'card_cancellation'
  | 'card_replacement'
  | 'refund_excess'
  | 'wrongly_deposited'
  | 'noc_letter'
  | 'mailing_address_change'
  | 'duplicate_statement'
  | 'reversal_charges'
  | 'card_unblocking'
  | 'redelivery_card'
  | 'limit_enhancement'
  | 'contact_change'
  | 'ccp_enrolment'
  | 'ccp_cancellation'
  | 'other';

export const CREDIT_CARD_REQUEST_TYPE_OPTIONS: { value: CreditCardRequestType; label: string }[] = [
  { value: 'address_change',          label: 'Address Change' },
  { value: 'balance_confirmation',    label: 'Balance Confirmation' },
  { value: 'estatement_enrolment',    label: 'E-Statement Enrolment' },
  { value: 'estatement_cancellation', label: 'E-Statement Cancellation' },
  { value: 'card_cancellation',       label: 'Card Cancellation' },
  { value: 'card_replacement',        label: 'Card Replacement' },
  { value: 'refund_excess',           label: 'Refund of Excess Amount' },
  { value: 'wrongly_deposited',       label: 'Wrongly Deposited Amount' },
  { value: 'noc_letter',              label: 'NOC Letter' },
  { value: 'mailing_address_change',  label: 'Mailing Address Change' },
  { value: 'duplicate_statement',     label: 'Duplicate Statement' },
  { value: 'reversal_charges',        label: 'Reversal of Charges' },
  { value: 'card_unblocking',         label: 'Card Unblocking' },
  { value: 'redelivery_card',         label: 'Re-delivery of Card' },
  { value: 'limit_enhancement',       label: 'Limit Enhancement' },
  { value: 'contact_change',          label: 'Contact Change' },
  { value: 'ccp_enrolment',           label: 'CCP Enrolment' },
  { value: 'ccp_cancellation',        label: 'CCP Cancellation' },
  { value: 'other',                   label: 'Other' },
];

// ────────────────────────────────────────────────────────────
// Branch (minimal shape for assignment)
// ────────────────────────────────────────────────────────────
export interface CreditCardBranch {
  id: number;
  branch_code: string;
  branch_name: string;
  city: string;
}

// ────────────────────────────────────────────────────────────
// Creator (minimal shape embedded in response)
// ────────────────────────────────────────────────────────────
export interface CreditCardCreator {
  id: number;
  employee_code: string;
  employee_name: string;
  designation: string;
}

// ────────────────────────────────────────────────────────────
// Biometric log entry
// ────────────────────────────────────────────────────────────
export interface BiometricLog {
  id: number;
  status: string;
  status_label: string;
  transaction_id: string | null;
  response_data: Record<string, unknown> | null;
  created_at: string;
}

// ────────────────────────────────────────────────────────────
// Full Credit Card Request (API response shape)
// ────────────────────────────────────────────────────────────
export interface CreditCardRequest {
  id: number;
  request_number: string;

  // Customer
  customer_name: string;
  customer_cnic: string;
  credit_card_number: string;
  contact_no: string;
  email: string | null;

  // Request details
  request_type: CreditCardRequestType;
  request_type_label: string;
  other_request_details: string | null;
  details: string | null;

  // Biometric
  biometric_verified: boolean;
  biometric_transaction_id: string | null;
  biometric_verified_at: string | null;

  // Status
  status: RequestStatus;
  status_label: string;
  status_color: string;

  // Relations
  branch_id: number | null;
  branch: CreditCardBranch | null;
  created_by: number;
  creator: CreditCardCreator | null;
  biometric_logs?: BiometricLog[];

  // Timestamps
  created_at: string;
  updated_at: string;
  created_at_human: string;
}

// ────────────────────────────────────────────────────────────
// Form data (what the user fills in)
// ────────────────────────────────────────────────────────────
export interface CreditCardRequestFormData {
  customer_name: string;
  customer_cnic: string;
  credit_card_number: string;
  contact_no: string;
  email: string;
  request_type: CreditCardRequestType | '';
  other_request_details: string;
  details: string;
  branch_id: string; // kept as string for form inputs
}

// ────────────────────────────────────────────────────────────
// Paginated list response
// ────────────────────────────────────────────────────────────
export interface CreditCardRequestListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CreditCardRequestListResponse {
  data: CreditCardRequest[];
  meta: CreditCardRequestListMeta;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// ────────────────────────────────────────────────────────────
// Filter / query params for index endpoint
// ────────────────────────────────────────────────────────────
export interface CreditCardRequestFilters {
  search?: string;
  status?: RequestStatus | '';
  request_type?: CreditCardRequestType | '';
  date_from?: string;
  date_to?: string;
  branch_id?: string;
  biometric_verified?: boolean | '';
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

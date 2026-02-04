<?php

namespace App\Enums;

enum LoanRequestType: string
{
    case LOAN_SETTLEMENT = 'loan_settlement';
    case PAYOFF_SHEET = 'payoff_sheet';
    case PARTIAL_PAYMENT = 'partial_payment';
    case NOC_ISSUANCE = 'noc_issuance';
    case INSURANCE_CLAIM = 'insurance_claim';
    case RELEASE_DOCUMENTS = 'release_documents';
    case REFUND_EXCESS = 'refund_excess';
    case ADJUSTMENT_EXCESS = 'adjustment_excess';
    case DEMOGRAPHICS_CHANGE = 'demographics_change';
    case PAYMENT_MODE_CHANGE = 'payment_mode_change';
    case INSURANCE_POLICY = 'insurance_policy';
    case COPY_DOCUMENTS = 'copy_documents';
    case PAY_ORDER_COLLECTION = 'pay_order_collection';
    case AMORTIZATION_SCHEDULE = 'amortization_schedule';
    case VERIFICATION_DOCUMENTS = 'verification_documents';
    case WAIVER_CHARGES = 'waiver_charges';
    case TAX_CERTIFICATE = 'tax_certificate';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::LOAN_SETTLEMENT => 'Loan Settlement',
            self::PAYOFF_SHEET => 'Payoff Sheet',
            self::PARTIAL_PAYMENT => 'Partial Payment',
            self::NOC_ISSUANCE => 'NOC Issuance',
            self::INSURANCE_CLAIM => 'Insurance Claim',
            self::RELEASE_DOCUMENTS => 'Release Documents',
            self::REFUND_EXCESS => 'Refund Excess',
            self::ADJUSTMENT_EXCESS => 'Adjustment Excess',
            self::DEMOGRAPHICS_CHANGE => 'Demographics Change',
            self::PAYMENT_MODE_CHANGE => 'Payment Mode Change',
            self::INSURANCE_POLICY => 'Insurance Policy',
            self::COPY_DOCUMENTS => 'Copy Documents',
            self::PAY_ORDER_COLLECTION => 'Pay Order Collection',
            self::AMORTIZATION_SCHEDULE => 'Amortization Schedule',
            self::VERIFICATION_DOCUMENTS => 'Verification Documents',
            self::WAIVER_CHARGES => 'Waiver Charges',
            self::TAX_CERTIFICATE => 'Tax Certificate',
            self::OTHER => 'Other',
        };
    }
}

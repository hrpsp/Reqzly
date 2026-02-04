<?php

namespace App\Enums;

enum CreditCardRequestType: string
{
    case ADDRESS_CHANGE = 'address_change';
    case BALANCE_CONFIRMATION = 'balance_confirmation';
    case ESTATEMENT_ENROLMENT = 'estatement_enrolment';
    case ESTATEMENT_CANCELLATION = 'estatement_cancellation';
    case CARD_CANCELLATION = 'card_cancellation';
    case CARD_REPLACEMENT = 'card_replacement';
    case REFUND_EXCESS = 'refund_excess';
    case WRONGLY_DEPOSITED = 'wrongly_deposited';
    case NOC_LETTER = 'noc_letter';
    case MAILING_ADDRESS_CHANGE = 'mailing_address_change';
    case DUPLICATE_STATEMENT = 'duplicate_statement';
    case REVERSAL_CHARGES = 'reversal_charges';
    case CARD_UNBLOCKING = 'card_unblocking';
    case REDELIVERY_CARD = 'redelivery_card';
    case LIMIT_ENHANCEMENT = 'limit_enhancement';
    case CONTACT_CHANGE = 'contact_change';
    case CCP_ENROLMENT = 'ccp_enrolment';
    case CCP_CANCELLATION = 'ccp_cancellation';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::ADDRESS_CHANGE => 'Address Change',
            self::BALANCE_CONFIRMATION => 'Balance Confirmation',
            self::ESTATEMENT_ENROLMENT => 'E-Statement Enrolment',
            self::ESTATEMENT_CANCELLATION => 'E-Statement Cancellation',
            self::CARD_CANCELLATION => 'Card Cancellation',
            self::CARD_REPLACEMENT => 'Card Replacement',
            self::REFUND_EXCESS => 'Refund Excess',
            self::WRONGLY_DEPOSITED => 'Wrongly Deposited',
            self::NOC_LETTER => 'NOC Letter',
            self::MAILING_ADDRESS_CHANGE => 'Mailing Address Change',
            self::DUPLICATE_STATEMENT => 'Duplicate Statement',
            self::REVERSAL_CHARGES => 'Reversal Charges',
            self::CARD_UNBLOCKING => 'Card Unblocking',
            self::REDELIVERY_CARD => 'Redelivery Card',
            self::LIMIT_ENHANCEMENT => 'Limit Enhancement',
            self::CONTACT_CHANGE => 'Contact Change',
            self::CCP_ENROLMENT => 'CCP Enrolment',
            self::CCP_CANCELLATION => 'CCP Cancellation',
            self::OTHER => 'Other',
        };
    }
}

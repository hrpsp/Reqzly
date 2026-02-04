<?php

namespace App\Enums;

enum LoanType: string
{
    case AUTO_LOAN = 'auto_loan';
    case PERSONAL_LOAN = 'personal_loan';
    case HOME_LOAN = 'home_loan';

    public function label(): string
    {
        return match ($this) {
            self::AUTO_LOAN => 'Auto Loan',
            self::PERSONAL_LOAN => 'Personal Loan',
            self::HOME_LOAN => 'Home Loan',
        };
    }
}

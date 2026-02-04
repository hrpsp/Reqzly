<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case SUCCESS = 'success';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::SUCCESS => 'Success',
            self::FAILED => 'Failed',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::SUCCESS => 'green',
            self::FAILED => 'red',
        };
    }
}

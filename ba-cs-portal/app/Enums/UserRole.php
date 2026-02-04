<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SUPERVISOR = 'supervisor';
    case STAFF = 'staff';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::SUPERVISOR => 'Supervisor',
            self::STAFF => 'Staff',
        };
    }
}

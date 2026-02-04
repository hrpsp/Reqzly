<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'employee_code' => 'EMP001',
            'employee_name' => 'System Administrator',
            'designation' => 'System Administrator',
            'department' => 'IT',
            'region' => 'Head Office',
            'mobile_number' => '03001234567',
            'email' => 'admin@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Supervisors
        $supervisorLahore = User::create([
            'employee_code' => 'EMP002',
            'employee_name' => 'Ahmad Khan',
            'designation' => 'Branch Supervisor',
            'department' => 'Customer Service',
            'reports_to' => $admin->id,
            'region' => 'Central Punjab',
            'mobile_number' => '03011234567',
            'email' => 'ahmad.khan@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'supervisor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $supervisorKarachi = User::create([
            'employee_code' => 'EMP003',
            'employee_name' => 'Fatima Ali',
            'designation' => 'Branch Supervisor',
            'department' => 'Customer Service',
            'reports_to' => $admin->id,
            'region' => 'Sindh',
            'mobile_number' => '03021234567',
            'email' => 'fatima.ali@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'supervisor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Staff Users reporting to Lahore Supervisor
        User::create([
            'employee_code' => 'EMP004',
            'employee_name' => 'Hassan Raza',
            'designation' => 'Customer Service Officer',
            'department' => 'Customer Service',
            'reports_to' => $supervisorLahore->id,
            'region' => 'Central Punjab',
            'mobile_number' => '03031234567',
            'email' => 'hassan.raza@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'employee_code' => 'EMP005',
            'employee_name' => 'Sara Malik',
            'designation' => 'Customer Service Officer',
            'department' => 'Customer Service',
            'reports_to' => $supervisorLahore->id,
            'region' => 'Central Punjab',
            'mobile_number' => '03041234567',
            'email' => 'sara.malik@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'employee_code' => 'EMP006',
            'employee_name' => 'Usman Ahmed',
            'designation' => 'Customer Service Officer',
            'department' => 'Loans',
            'reports_to' => $supervisorLahore->id,
            'region' => 'South Punjab',
            'mobile_number' => '03051234567',
            'email' => 'usman.ahmed@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Staff Users reporting to Karachi Supervisor
        User::create([
            'employee_code' => 'EMP007',
            'employee_name' => 'Ayesha Siddiqui',
            'designation' => 'Customer Service Officer',
            'department' => 'Credit Cards',
            'reports_to' => $supervisorKarachi->id,
            'region' => 'Sindh',
            'mobile_number' => '03061234567',
            'email' => 'ayesha.siddiqui@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        User::create([
            'employee_code' => 'EMP008',
            'employee_name' => 'Bilal Hussain',
            'designation' => 'Customer Service Officer',
            'department' => 'Customer Service',
            'reports_to' => $supervisorKarachi->id,
            'region' => 'Sindh',
            'mobile_number' => '03071234567',
            'email' => 'bilal.hussain@bankalfalah.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}

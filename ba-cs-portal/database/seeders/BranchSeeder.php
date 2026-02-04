<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'branch_code' => 'LHR-001',
                'branch_name' => 'Lahore Main Branch',
                'region' => 'Central Punjab',
                'city' => 'Lahore',
                'address' => '23-A, Mall Road, Lahore',
                'is_active' => true,
            ],
            [
                'branch_code' => 'LHR-002',
                'branch_name' => 'Lahore DHA Branch',
                'region' => 'Central Punjab',
                'city' => 'Lahore',
                'address' => '45-B, DHA Phase 5, Lahore',
                'is_active' => true,
            ],
            [
                'branch_code' => 'KHI-001',
                'branch_name' => 'Karachi Clifton Branch',
                'region' => 'Sindh',
                'city' => 'Karachi',
                'address' => 'Block 8, Clifton, Karachi',
                'is_active' => true,
            ],
            [
                'branch_code' => 'KHI-002',
                'branch_name' => 'Karachi Gulshan Branch',
                'region' => 'Sindh',
                'city' => 'Karachi',
                'address' => 'Block 13-A, Gulshan-e-Iqbal, Karachi',
                'is_active' => true,
            ],
            [
                'branch_code' => 'ISB-001',
                'branch_name' => 'Islamabad Blue Area Branch',
                'region' => 'North',
                'city' => 'Islamabad',
                'address' => 'Blue Area, Jinnah Avenue, Islamabad',
                'is_active' => true,
            ],
            [
                'branch_code' => 'ISB-002',
                'branch_name' => 'Rawalpindi Saddar Branch',
                'region' => 'North',
                'city' => 'Rawalpindi',
                'address' => 'Saddar Road, Rawalpindi',
                'is_active' => true,
            ],
            [
                'branch_code' => 'FSD-001',
                'branch_name' => 'Faisalabad D-Ground Branch',
                'region' => 'Central Punjab',
                'city' => 'Faisalabad',
                'address' => 'D-Ground, Peoples Colony, Faisalabad',
                'is_active' => true,
            ],
            [
                'branch_code' => 'MUL-001',
                'branch_name' => 'Multan Cantt Branch',
                'region' => 'South Punjab',
                'city' => 'Multan',
                'address' => 'Cantt Area, Multan',
                'is_active' => true,
            ],
            [
                'branch_code' => 'PSH-001',
                'branch_name' => 'Peshawar University Road Branch',
                'region' => 'KPK',
                'city' => 'Peshawar',
                'address' => 'University Road, Peshawar',
                'is_active' => true,
            ],
            [
                'branch_code' => 'QTA-001',
                'branch_name' => 'Quetta Jinnah Road Branch',
                'region' => 'Balochistan',
                'city' => 'Quetta',
                'address' => 'Jinnah Road, Quetta',
                'is_active' => true,
            ],
        ];

        foreach ($branches as $branch) {
            Branch::create($branch);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin1@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'approved' => '1',
            'site' => 'Ploufragan',
            'departement' => 'Informatique'
        ]);

        User::create([
            'name' => 'Service',
            'email' => 'service@example.com',
            'password' => Hash::make('admin123'),
            'role' => 'service',
            'approved' => '1',
            'site' => 'Ploufragan',
            'departement' => 'Informatique'
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test customers
        User::create([
            'name' => 'Ahmed Hassan',
            'email' => 'ahmed@test.com',
            'password' => 'password',
            'phone' => '+971501111111',
            'role' => 'customer',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Fatima Ali',
            'email' => 'fatima@test.com',
            'password' => 'password',
            'phone' => '+971502222222',
            'role' => 'customer',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Mohammed Salem',
            'email' => 'mohammed@test.com',
            'password' => Hash::make('password'),
            'phone' => '+971503333333',
            'role' => 'customer',
            'is_active' => true,
        ]);

        // Create test drivers
        User::create([
            'name' => 'Khalid Driver',
            'email' => 'khalid.driver@test.com',
            'password' => Hash::make('password'),
            'phone' => '+971504444444',
            'role' => 'driver',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Omar Driver',
            'email' => 'omar.driver@test.com',
            'password' => Hash::make('password'),
            'phone' => '+971505555555',
            'role' => 'driver',
            'is_active' => true,
        ]);
    }
}

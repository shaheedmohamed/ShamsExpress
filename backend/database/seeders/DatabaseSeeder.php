<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@shamsexpress.com',
            'password' => bcrypt('password'),
            'phone' => '+201234567890',
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Driver One',
            'email' => 'driver@shamsexpress.com',
            'password' => bcrypt('password'),
            'phone' => '+201234567891',
            'role' => 'driver',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Customer User',
            'email' => 'customer@shamsexpress.com',
            'password' => bcrypt('password'),
            'phone' => '+201234567892',
            'role' => 'customer',
            'is_active' => true,
        ]);
    }
}

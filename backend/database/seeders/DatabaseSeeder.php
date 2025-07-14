<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Shormi Sen',
            'email' => 'shormi@gmail.com',
        ]);
        User::factory()->create([
            'name' => 'Sristy Das',
            'email' => 'sristy@gmail.com',
        ]);
    }
}

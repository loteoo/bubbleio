<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        factory(App\User::class, 15)->create();

        factory(App\Bubble::class, 5)->create();

        factory(App\Thread::class, 30)->create();

        factory(App\Bubble::class, 100)->create();
    }
}

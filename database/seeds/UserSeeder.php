<?php

use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      factory(App\User::class, 5)->create()->each(function ($user) {
        $user->bubbles()->save(factory(App\Bubble::class)->make());
      });
    }
}

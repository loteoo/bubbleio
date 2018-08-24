<?php

use Faker\Generator as Faker;

$factory->define(App\Message::class, function (Faker $faker) {
    return [
        'text' => $faker->sentence($faker->numberBetween(5, 20)),
        'thread_id' => App\Thread::all()->random()->id,
        'user_id' => App\User::all()->random()->id,
        'created_at' => $faker->dateTimeBetween('-3 years', 'now')
    ];
});

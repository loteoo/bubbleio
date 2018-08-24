<?php

use Faker\Generator as Faker;

$factory->define(App\Bubble::class, function (Faker $faker) {
    $title = $faker->catchPhrase;
    return [
        'name' => str_slug($title, '-'),
        'title' => $title,
        'description' => $faker->text,
        'public' => $faker->boolean,
        'default' => $faker->boolean,
        'user_id' => App\User::all()->random()->id,
        'created_at' => $faker->dateTimeBetween('-3 years', 'now')
    ];
});

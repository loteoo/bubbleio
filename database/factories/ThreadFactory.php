<?php

use Faker\Generator as Faker;

$factory->define(App\Thread::class, function (Faker $faker) {
    $types = array("default", "text", "link", "image");
    
    $randType = array_rand($types);

    return [
        'title' => $faker->catchPhrase,
        'text' => $faker->text,
        'link' => $faker->url,
        'image' => $faker->imageUrl,
        'votes' => $faker->numberBetween(0, 500),
        'type' => $types[$randType],
        'user_id' => App\User::all()->random()->id,
        'bubble_id' => App\Bubble::all()->random()->id,
        'created_at' => $faker->dateTimeBetween('-3 years', 'now')
    ];
});

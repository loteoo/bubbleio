<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bubble extends Model
{
    //
    public function author() {
        return $this->hasOne('App\User');
    }

    public function threads() {
        return $this->hasMany('App\Thread');
    }
}

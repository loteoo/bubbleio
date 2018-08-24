<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    //
    public function author() {
      return $this->hasOne('App\User');
    }

    public function bubble() {
      return $this->hasOne('App\Bubble');
    }

    public function messages() {
        return $this->hasMany('App\Message');
    }
}

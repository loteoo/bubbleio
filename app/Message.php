<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    //



    public function sender() {
        return $this->hasOne('App\User');
    }

    public function thread() {
        return $this->hasOne('App\Thread');
    }


}

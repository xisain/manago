<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class balance extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'current_balance',  
    ];
}

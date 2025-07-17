<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class transaction extends Model
{
    protected $table = 'transactions';
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'category',
        'description',
        'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}

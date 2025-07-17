<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\balance;


class transaction extends Model
{
    protected $table = 'transactions';
    protected $fillable = [
        'balance_id',
        'type',
        'amount',
        'category',
        'description',
        'date',
    ];

    public function balance()
    {
        return $this->belongsTo(balance::class);
    }

    public function user()
    {
    // akses user melalui relasi balance
        return $this->hasOneThrough(User::class, balance::class, 'id', 'id', 'balance_id', 'user_id');
    }

}

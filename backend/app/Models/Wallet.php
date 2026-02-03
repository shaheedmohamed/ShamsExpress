<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
        'total_earnings',
        'total_spent',
        'pending_amount',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'total_spent' => 'decimal:2',
        'pending_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function addCredit($amount, $description, $orderId = null, $reference = null)
    {
        $this->balance += $amount;
        $this->total_earnings += $amount;
        $this->save();

        return $this->transactions()->create([
            'order_id' => $orderId,
            'type' => 'credit',
            'amount' => $amount,
            'balance_after' => $this->balance,
            'description' => $description,
            'reference' => $reference,
        ]);
    }

    public function deductAmount($amount, $description, $orderId = null, $reference = null)
    {
        if ($this->balance < $amount) {
            throw new \Exception('Insufficient balance');
        }

        $this->balance -= $amount;
        $this->total_spent += $amount;
        $this->save();

        return $this->transactions()->create([
            'order_id' => $orderId,
            'type' => 'debit',
            'amount' => $amount,
            'balance_after' => $this->balance,
            'description' => $description,
            'reference' => $reference,
        ]);
    }
}

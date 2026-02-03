<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    const ROLE_ADMIN = 'admin';
    const ROLE_DRIVER = 'driver';
    const ROLE_CUSTOMER = 'customer';

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'avatar',
        'is_active',
        'is_guest',
        'guest_identifier',
        'saved_addresses',
        'pickup_commission_rate',
        'delivery_commission_rate',
        'same_driver_commission_rate',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'is_guest' => 'boolean',
        'saved_addresses' => 'array',
    ];

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function deliveryOrders()
    {
        return $this->hasMany(DeliveryOrder::class, 'customer_id');
    }

    public function driverOrders()
    {
        return $this->hasMany(DeliveryOrder::class, 'driver_id');
    }

    public function withdrawalRequests()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }

    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isCustomer()
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isDriver()
    {
        return $this->role === self::ROLE_DRIVER;
    }

    public function isGuest()
    {
        return $this->is_guest === true;
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            if (!$user->wallet) {
                $user->wallet()->create([
                    'balance' => 0,
                    'total_earnings' => 0,
                    'total_spent' => 0,
                    'pending_amount' => 0,
                ]);
            }
        });
    }
}

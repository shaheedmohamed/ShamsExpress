<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ar',
        'zone_type',
        'additional_fee',
        'areas',
        'is_active',
    ];

    protected $casts = [
        'additional_fee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function orders()
    {
        return $this->hasMany(DeliveryOrder::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeStandard($query)
    {
        return $query->where('zone_type', 'standard');
    }

    public function scopePremium($query)
    {
        return $query->where('zone_type', 'premium');
    }
}

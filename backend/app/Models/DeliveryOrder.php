<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryOrder extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_PICKED_UP = 'picked_up';
    const STATUS_IN_TRANSIT = 'in_transit';
    const STATUS_DELIVERED_TO_WAREHOUSE = 'delivered_to_warehouse';
    const STATUS_WAREHOUSE_TO_DELIVERY = 'warehouse_to_delivery';
    const STATUS_PICKED_UP_FROM_WAREHOUSE = 'picked_up_from_warehouse';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'customer_id',
        'driver_id',
        'pickup_address',
        'pickup_latitude',
        'pickup_longitude',
        'delivery_address',
        'delivery_latitude',
        'delivery_longitude',
        'package_description',
        'recipient_name',
        'recipient_phone',
        'delivery_fee',
        'status',
        'notes',
        'picked_up_at',
        'delivered_to_warehouse_at',
        'picked_up_from_warehouse_at',
        'delivered_at',
    ];

    protected $casts = [
        'pickup_latitude' => 'decimal:8',
        'pickup_longitude' => 'decimal:8',
        'delivery_latitude' => 'decimal:8',
        'delivery_longitude' => 'decimal:8',
        'delivery_fee' => 'decimal:2',
        'picked_up_at' => 'datetime',
        'delivered_to_warehouse_at' => 'datetime',
        'picked_up_from_warehouse_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', [
            self::STATUS_ACCEPTED,
            self::STATUS_PICKED_UP,
            self::STATUS_IN_TRANSIT,
            self::STATUS_WAREHOUSE_TO_DELIVERY,
            self::STATUS_PICKED_UP_FROM_WAREHOUSE,
        ]);
    }

    public function scopeInWarehouse($query)
    {
        return $query->where('status', self::STATUS_DELIVERED_TO_WAREHOUSE);
    }

    public function scopePendingWarehouseDelivery($query)
    {
        return $query->where('status', self::STATUS_WAREHOUSE_TO_DELIVERY);
    }

    public function isWarehouseStatus()
    {
        return in_array($this->status, [
            self::STATUS_DELIVERED_TO_WAREHOUSE,
            self::STATUS_WAREHOUSE_TO_DELIVERY,
            self::STATUS_PICKED_UP_FROM_WAREHOUSE,
        ]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_DELIVERED);
    }
}

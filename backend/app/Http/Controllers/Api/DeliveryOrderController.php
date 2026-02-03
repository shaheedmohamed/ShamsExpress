<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;

class DeliveryOrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = DeliveryOrder::with(['customer', 'driver', 'shipmentType', 'deliveryZone']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        } elseif ($user->isDriver()) {
            $query->where('driver_id', $user->id)
                  ->orWhere('status', DeliveryOrder::STATUS_PENDING);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipment_type_id' => 'required|exists:shipment_types,id',
            'delivery_zone_id' => 'required|exists:delivery_zones,id',
            'pickup_address' => 'required|string',
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'delivery_address' => 'required|string',
            'delivery_latitude' => 'required|numeric',
            'delivery_longitude' => 'required|numeric',
            'recipient_name' => 'required|string',
            'recipient_phone' => 'required|string',
            'sender_phone' => 'nullable|string',
            'product_value' => 'nullable|numeric',
            'delivery_fee' => 'nullable|numeric',
        ]);

        $order = DeliveryOrder::create([
            'customer_id' => $request->user()->id,
            'shipment_type_id' => $request->shipment_type_id,
            'delivery_zone_id' => $request->delivery_zone_id,
            'pickup_address' => $request->pickup_address,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'delivery_address' => $request->delivery_address,
            'delivery_latitude' => $request->delivery_latitude,
            'delivery_longitude' => $request->delivery_longitude,
            'recipient_name' => $request->recipient_name,
            'recipient_phone' => $request->recipient_phone,
            'sender_phone' => $request->sender_phone,
            'product_value' => $request->product_value,
            'delivery_fee' => $request->delivery_fee ?? 0,
            'status' => DeliveryOrder::STATUS_PENDING,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => DeliveryOrder::STATUS_PENDING,
            'changed_by' => $request->user()->id,
            'notes' => 'Order created',
        ]);

        return response()->json($order->load(['customer', 'driver', 'shipmentType', 'deliveryZone']), 201);
    }

    public function show($id)
    {
        $order = DeliveryOrder::with(['customer', 'driver', 'statusHistories.user', 'shipmentType', 'deliveryZone'])
                              ->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,picked_up,in_transit,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order = DeliveryOrder::findOrFail($id);
        $user = $request->user();

        if ($user->isDriver() && $request->status === DeliveryOrder::STATUS_ACCEPTED && !$order->driver_id) {
            $order->driver_id = $user->id;
        }

        $order->status = $request->status;

        if ($request->status === DeliveryOrder::STATUS_PICKED_UP) {
            $order->picked_up_at = now();
        }

        if ($request->status === DeliveryOrder::STATUS_DELIVERED) {
            $order->delivered_at = now();
            
            \Log::info('Order delivered', [
                'order_id' => $order->id,
                'product_value' => $order->product_value,
                'customer_id' => $order->customer_id,
                'has_customer' => $order->customer ? 'yes' : 'no',
            ]);
            
            // Transfer product value to customer wallet
            if ($order->product_value && $order->product_value > 0 && $order->customer) {
                $customerWallet = $order->customer->wallet;
                
                \Log::info('Processing wallet transfer', [
                    'customer_id' => $order->customer->id,
                    'has_wallet' => $customerWallet ? 'yes' : 'no',
                    'amount' => $order->product_value,
                ]);
                
                // Create wallet if doesn't exist
                if (!$customerWallet) {
                    $customerWallet = \App\Models\Wallet::create([
                        'user_id' => $order->customer->id,
                        'balance' => 0,
                        'total_earnings' => 0,
                        'total_spent' => 0,
                    ]);
                    \Log::info('Created new wallet', ['wallet_id' => $customerWallet->id]);
                }
                
                $oldBalance = $customerWallet->balance;
                $customerWallet->balance += $order->product_value;
                $customerWallet->total_earnings += $order->product_value;
                $customerWallet->save();
                
                \Log::info('Wallet updated', [
                    'wallet_id' => $customerWallet->id,
                    'old_balance' => $oldBalance,
                    'new_balance' => $customerWallet->balance,
                    'amount_added' => $order->product_value,
                ]);
                
                \App\Models\WalletTransaction::create([
                    'wallet_id' => $customerWallet->id,
                    'type' => 'credit',
                    'amount' => $order->product_value,
                    'description' => 'Product value from order #' . $order->id,
                    'reference_type' => 'order',
                    'reference_id' => $order->id,
                ]);
                
                \Log::info('Transaction created successfully');
            } else {
                \Log::warning('Wallet transfer skipped', [
                    'product_value' => $order->product_value,
                    'has_customer' => $order->customer ? 'yes' : 'no',
                ]);
            }
            
            // Transfer commission to driver wallet
            if ($order->driver_id && $order->delivery_fee > 0) {
                $driver = $order->driver;
                $driverWallet = $driver->wallet;
                
                // Create wallet if doesn't exist
                if (!$driverWallet) {
                    $driverWallet = \App\Models\Wallet::create([
                        'user_id' => $driver->id,
                        'balance' => 0,
                        'total_earnings' => 0,
                        'total_spent' => 0,
                    ]);
                }
                
                $commission = $order->delivery_fee * (($driver->same_driver_commission_rate ?? 70) / 100);
                
                $driverWallet->balance += $commission;
                $driverWallet->total_earnings += $commission;
                $driverWallet->save();
                
                \App\Models\WalletTransaction::create([
                    'wallet_id' => $driverWallet->id,
                    'type' => 'credit',
                    'amount' => $commission,
                    'description' => 'Commission from order #' . $order->id,
                    'reference_type' => 'order',
                    'reference_id' => $order->id,
                ]);
            }
        }

        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $request->status,
            'changed_by' => $user->id,
            'notes' => $request->notes ?? 'Status updated',
        ]);

        return response()->json($order->load(['customer', 'driver']));
    }

    public function cancel($id)
    {
        $order = DeliveryOrder::findOrFail($id);
        $user = auth()->user();

        if ($order->customer_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->status = DeliveryOrder::STATUS_CANCELLED;
        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => DeliveryOrder::STATUS_CANCELLED,
            'changed_by' => $user->id,
            'notes' => 'Order cancelled',
        ]);

        return response()->json($order);
    }

    public function statistics(Request $request)
    {
        $user = $request->user();

        if ($user->isCustomer()) {
            $stats = [
                'total_orders' => DeliveryOrder::where('customer_id', $user->id)->count(),
                'pending_orders' => DeliveryOrder::where('customer_id', $user->id)->pending()->count(),
                'active_orders' => DeliveryOrder::where('customer_id', $user->id)->active()->count(),
                'completed_orders' => DeliveryOrder::where('customer_id', $user->id)->completed()->count(),
            ];
        } elseif ($user->isDriver()) {
            $stats = [
                'total_deliveries' => DeliveryOrder::where('driver_id', $user->id)->count(),
                'active_deliveries' => DeliveryOrder::where('driver_id', $user->id)->active()->count(),
                'completed_deliveries' => DeliveryOrder::where('driver_id', $user->id)->completed()->count(),
                'available_orders' => DeliveryOrder::pending()->count(),
            ];
        } else {
            $stats = [
                'total_orders' => DeliveryOrder::count(),
                'pending_orders' => DeliveryOrder::pending()->count(),
                'active_orders' => DeliveryOrder::active()->count(),
                'completed_orders' => DeliveryOrder::completed()->count(),
            ];
        }

        return response()->json($stats);
    }
}

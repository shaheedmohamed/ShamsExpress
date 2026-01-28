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
        
        $query = DeliveryOrder::with(['customer', 'driver']);

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
            'pickup_address' => 'required|string',
            'pickup_latitude' => 'required|numeric',
            'pickup_longitude' => 'required|numeric',
            'delivery_address' => 'required|string',
            'delivery_latitude' => 'required|numeric',
            'delivery_longitude' => 'required|numeric',
            'package_description' => 'nullable|string',
            'recipient_name' => 'required|string',
            'recipient_phone' => 'required|string',
            'delivery_fee' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $order = DeliveryOrder::create([
            'customer_id' => $request->user()->id,
            'pickup_address' => $request->pickup_address,
            'pickup_latitude' => $request->pickup_latitude,
            'pickup_longitude' => $request->pickup_longitude,
            'delivery_address' => $request->delivery_address,
            'delivery_latitude' => $request->delivery_latitude,
            'delivery_longitude' => $request->delivery_longitude,
            'package_description' => $request->package_description,
            'recipient_name' => $request->recipient_name,
            'recipient_phone' => $request->recipient_phone,
            'delivery_fee' => $request->delivery_fee ?? 0,
            'notes' => $request->notes,
            'status' => DeliveryOrder::STATUS_PENDING,
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => DeliveryOrder::STATUS_PENDING,
            'changed_by' => $request->user()->id,
            'notes' => 'Order created',
        ]);

        return response()->json($order->load(['customer', 'driver']), 201);
    }

    public function show($id)
    {
        $order = DeliveryOrder::with(['customer', 'driver', 'statusHistories.user'])
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

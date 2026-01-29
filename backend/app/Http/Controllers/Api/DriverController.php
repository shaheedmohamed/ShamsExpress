<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\OrderStatusHistory;
use App\Services\PushNotificationService;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function dashboard()
    {
        $driver = auth()->user();

        if ($driver->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_deliveries' => DeliveryOrder::where('driver_id', $driver->id)->count(),
            'active_deliveries' => DeliveryOrder::where('driver_id', $driver->id)
                ->whereIn('status', ['accepted', 'picked_up', 'in_transit'])
                ->count(),
            'completed_deliveries' => DeliveryOrder::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->count(),
            'pending_orders' => DeliveryOrder::where('driver_id', $driver->id)
                ->where('status', 'pending')
                ->count(),
        ];

        $activeOrders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['accepted', 'picked_up', 'in_transit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'stats' => $stats,
            'active_orders' => $activeOrders,
        ]);
    }

    public function availableOrders()
    {
        $driver = auth()->user();

        if ($driver->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function myOrders()
    {
        $driver = auth()->user();

        if ($driver->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function acceptOrder($id)
    {
        $driver = auth()->user();

        if ($driver->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = DeliveryOrder::findOrFail($id);

        if ($order->driver_id !== $driver->id) {
            return response()->json(['message' => 'This order is not assigned to you'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'This order is no longer available'], 400);
        }

        $order->update(['status' => 'accepted']);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'accepted',
            'changed_by' => $driver->id,
            'notes' => 'Order accepted by driver',
        ]);

        PushNotificationService::sendOrderStatusNotification(
            $order->customer,
            $order,
            'accepted'
        );

        return response()->json([
            'message' => 'Order accepted successfully',
            'order' => $order->load('customer'),
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:picked_up,in_transit,delivered_to_warehouse,delivered',
            'notes' => 'nullable|string',
        ]);

        $driver = auth()->user();

        if ($driver->role !== 'driver') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order = DeliveryOrder::findOrFail($id);

        if ($order->driver_id !== $driver->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->status = $request->status;

        if ($request->status === 'picked_up') {
            $order->picked_up_at = now();
        } elseif ($request->status === 'delivered_to_warehouse') {
            $order->delivered_to_warehouse_at = now();
            // Clear driver assignment for warehouse stage
            $order->driver_id = null;
        } elseif ($request->status === 'delivered') {
            $order->delivered_at = now();
        }

        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $request->status,
            'changed_by' => $driver->id,
            'notes' => $request->notes ?? 'Status updated by driver',
        ]);

        PushNotificationService::sendOrderStatusNotification(
            $order->customer,
            $order,
            $request->status
        );

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load('customer'),
        ]);
    }
}

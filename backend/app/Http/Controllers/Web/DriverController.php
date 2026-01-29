<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    public function dashboard()
    {
        $driver = auth()->user();

        $stats = [
            'total_deliveries' => DeliveryOrder::where('driver_id', $driver->id)->count(),
            'active_deliveries' => DeliveryOrder::where('driver_id', $driver->id)
                ->whereIn('status', ['accepted', 'picked_up', 'in_transit'])
                ->count(),
            'completed_deliveries' => DeliveryOrder::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->count(),
            'available_orders' => DeliveryOrder::where('status', 'pending')->count(),
        ];

        $activeOrders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['accepted', 'picked_up', 'in_transit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return view('driver.dashboard', compact('stats', 'activeOrders'));
    }

    public function availableOrders()
    {
        $driver = auth()->user();
        
        $orders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->where('status', 'accepted')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('driver.available-orders', compact('orders'));
    }

    public function myOrders()
    {
        $driver = auth()->user();

        $orders = DeliveryOrder::with('customer')
            ->where('driver_id', $driver->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('driver.my-orders', compact('orders'));
    }

    public function showOrder($id)
    {
        $order = DeliveryOrder::with(['customer', 'statusHistories.user'])
            ->findOrFail($id);

        return view('driver.order-details', compact('order'));
    }

    public function acceptOrder($id)
    {
        $order = DeliveryOrder::findOrFail($id);
        $driver = auth()->user();

        if ($order->status !== 'pending') {
            return redirect()->back()->with('error', 'This order is no longer available');
        }

        $order->update([
            'driver_id' => $driver->id,
            'status' => 'accepted',
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'accepted',
            'changed_by' => $driver->id,
            'notes' => 'Order accepted by driver',
        ]);

        return redirect()->route('driver.orders.show', $id)->with('success', 'Order accepted successfully');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:picked_up,in_transit,delivered',
            'notes' => 'nullable|string',
        ]);

        $order = DeliveryOrder::findOrFail($id);
        $driver = auth()->user();

        if ($order->driver_id !== $driver->id) {
            return redirect()->back()->with('error', 'Unauthorized action');
        }

        $order->status = $request->status;

        if ($request->status === 'picked_up') {
            $order->picked_up_at = now();
        } elseif ($request->status === 'delivered') {
            $order->delivered_at = now();
        }

        $order->save();

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $request->status,
            'changed_by' => $driver->id,
            'notes' => $request->notes ?? 'Status updated',
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully');
    }
}

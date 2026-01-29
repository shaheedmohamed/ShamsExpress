<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\OrderStatusHistory;
use App\Models\User;
use App\Services\PushNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_orders' => DeliveryOrder::count(),
            'pending_orders' => DeliveryOrder::where('status', 'pending')->count(),
            'active_orders' => DeliveryOrder::whereIn('status', ['accepted', 'picked_up', 'in_transit'])->count(),
            'completed_orders' => DeliveryOrder::where('status', 'delivered')->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_drivers' => User::where('role', 'driver')->count(),
        ];

        $recentOrders = DeliveryOrder::with(['customer', 'driver'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentOrders'));
    }

    public function users()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(20);
        return view('admin.users.index', compact('users'));
    }

    public function createUser()
    {
        return view('admin.users.create');
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|string',
            'role' => 'required|in:admin,driver,customer',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $request->role,
            'is_active' => true,
        ]);

        return redirect()->route('admin.users')->with('success', 'User created successfully');
    }

    public function editUser($id)
    {
        $user = User::findOrFail($id);
        return view('admin.users.edit', compact('user'));
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'required|string',
            'role' => 'required|in:admin,driver,customer',
            'is_active' => 'boolean',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'is_active' => $request->has('is_active'),
        ]);

        return redirect()->route('admin.users')->with('success', 'User updated successfully');
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User deleted successfully');
    }

    public function orders()
    {
        $orders = DeliveryOrder::with(['customer', 'driver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.orders.index', compact('orders'));
    }

    public function showOrder($id)
    {
        $order = DeliveryOrder::with(['customer', 'driver', 'statusHistories.user'])
            ->findOrFail($id);
        
        $drivers = User::where('role', 'driver')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return view('admin.orders.show', compact('order', 'drivers'));
    }

    public function drivers()
    {
        $drivers = User::where('role', 'driver')
            ->withCount(['driverOrders'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.drivers.index', compact('drivers'));
    }

    public function assignDriver(Request $request, $id)
    {
        $request->validate([
            'driver_id' => 'required|exists:users,id',
        ]);

        $order = DeliveryOrder::findOrFail($id);
        $driver = User::where('id', $request->driver_id)
            ->where('role', 'driver')
            ->firstOrFail();

        $order->update([
            'driver_id' => $driver->id,
            'status' => 'accepted',
        ]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'accepted',
            'changed_by' => auth()->id(),
            'notes' => 'Driver assigned by admin: ' . $driver->name,
        ]);

        return redirect()->back()->with('success', 'Driver assigned successfully');
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,accepted,picked_up,in_transit,delivered,cancelled',
            'notes' => 'nullable|string',
        ]);

        $order = DeliveryOrder::findOrFail($id);
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
            'changed_by' => auth()->id(),
            'notes' => $request->notes ?? 'Status updated by admin',
        ]);

        PushNotificationService::sendOrderStatusNotification(
            $order->customer,
            $order,
            $request->status
        );

        return redirect()->back()->with('success', 'Order status updated successfully');
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\DeliveryOrder;
use App\Models\User;
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

        return view('admin.orders.show', compact('order'));
    }

    public function drivers()
    {
        $drivers = User::where('role', 'driver')
            ->withCount(['driverOrders'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.drivers.index', compact('drivers'));
    }
}

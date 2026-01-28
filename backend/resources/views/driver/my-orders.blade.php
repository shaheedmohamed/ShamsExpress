@extends('layouts.app')

@section('title', 'My Orders')

@section('sidebar')
    @include('layouts.driver-sidebar')
@endsection

@section('content')
<div class="container mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full">
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                @forelse($orders as $order)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">#{{ $order->id }}</td>
                    <td class="px-6 py-4">{{ $order->customer->name }}</td>
                    <td class="px-6 py-4">{{ Str::limit($order->pickup_address, 30) }}</td>
                    <td class="px-6 py-4">{{ Str::limit($order->delivery_address, 30) }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold
                            @if($order->status === 'accepted') bg-blue-100 text-blue-800
                            @elseif($order->status === 'picked_up') bg-purple-100 text-purple-800
                            @elseif($order->status === 'in_transit') bg-orange-100 text-orange-800
                            @elseif($order->status === 'delivered') bg-green-100 text-green-800
                            @else bg-gray-100 text-gray-800
                            @endif">
                            {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                        </span>
                    </td>
                    <td class="px-6 py-4">${{ number_format($order->delivery_fee, 2) }}</td>
                    <td class="px-6 py-4">
                        <a href="{{ route('driver.orders.show', $order->id) }}" class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-eye"></i> View
                        </a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">No orders found</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <div class="mt-4">
        {{ $orders->links() }}
    </div>
</div>
@endsection

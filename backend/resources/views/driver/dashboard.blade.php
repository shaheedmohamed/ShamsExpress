@extends('layouts.app')

@section('title', 'Driver Dashboard')

@section('sidebar')
    @include('layouts.driver-sidebar')
@endsection

@section('content')
<div class="container mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Driver Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Total Deliveries</p>
                    <p class="text-3xl font-bold text-gray-800">{{ $stats['total_deliveries'] }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-3">
                    <i class="fas fa-box text-blue-500 text-2xl"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Active Deliveries</p>
                    <p class="text-3xl font-bold text-gray-800">{{ $stats['active_deliveries'] }}</p>
                </div>
                <div class="bg-orange-100 rounded-full p-3">
                    <i class="fas fa-shipping-fast text-orange-500 text-2xl"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Completed</p>
                    <p class="text-3xl font-bold text-gray-800">{{ $stats['completed_deliveries'] }}</p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                    <i class="fas fa-check-circle text-green-500 text-2xl"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500 text-sm">Available Orders</p>
                    <p class="text-3xl font-bold text-gray-800">{{ $stats['available_orders'] }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                    <i class="fas fa-clock text-yellow-500 text-2xl"></i>
                </div>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Active Orders</h2>
        @if($activeOrders->count() > 0)
            <div class="space-y-4">
                @foreach($activeOrders as $order)
                <div class="border rounded-lg p-4 hover:shadow-md transition">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-bold text-lg">Order #{{ $order->id }}</h3>
                            <p class="text-sm text-gray-600 mt-1">
                                <i class="fas fa-user"></i> {{ $order->customer->name }}
                            </p>
                            <div class="mt-2 space-y-1">
                                <p class="text-sm">
                                    <i class="fas fa-map-marker-alt text-green-500"></i>
                                    <strong>Pickup:</strong> {{ $order->pickup_address }}
                                </p>
                                <p class="text-sm">
                                    <i class="fas fa-map-marker-alt text-red-500"></i>
                                    <strong>Delivery:</strong> {{ $order->delivery_address }}
                                </p>
                            </div>
                        </div>
                        <div class="ml-4">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold
                                @if($order->status === 'accepted') bg-blue-100 text-blue-800
                                @elseif($order->status === 'picked_up') bg-purple-100 text-purple-800
                                @else bg-orange-100 text-orange-800
                                @endif">
                                {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-4 flex justify-end">
                        <a href="{{ route('driver.orders.show', $order->id) }}" 
                           class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                            View Details
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
        @else
            <p class="text-gray-500 text-center py-8">No active orders</p>
        @endif
    </div>
</div>
@endsection

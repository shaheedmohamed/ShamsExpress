@extends('layouts.app')

@section('title', 'Order Details')

@section('sidebar')
    @include('layouts.driver-sidebar')
@endsection

@section('content')
<div class="container mx-auto">
    <div class="mb-6">
        <a href="{{ route('driver.my-orders') }}" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-arrow-left"></i> Back to My Orders
        </a>
    </div>
    
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Order #{{ $order->id }}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Order Information</h2>
            
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold
                        @if($order->status === 'accepted') bg-blue-100 text-blue-800
                        @elseif($order->status === 'picked_up') bg-purple-100 text-purple-800
                        @elseif($order->status === 'in_transit') bg-orange-100 text-orange-800
                        @elseif($order->status === 'delivered') bg-green-100 text-green-800
                        @else bg-gray-100 text-gray-800
                        @endif">
                        {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                    </span>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500">Customer</p>
                    <p class="font-semibold">{{ $order->customer->name }}</p>
                    <p class="text-sm">{{ $order->customer->phone }}</p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500">Delivery Fee</p>
                    <p class="font-semibold text-lg text-primary">${{ number_format($order->delivery_fee, 2) }}</p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500">Created At</p>
                    <p class="font-semibold">{{ $order->created_at->format('Y-m-d H:i:s') }}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
            
            <div class="space-y-4">
                <div>
                    <p class="text-sm text-gray-500 mb-1"><i class="fas fa-map-marker-alt text-green-500"></i> Pickup Address</p>
                    <p class="font-semibold">{{ $order->pickup_address }}</p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500 mb-1"><i class="fas fa-map-marker-alt text-red-500"></i> Delivery Address</p>
                    <p class="font-semibold">{{ $order->delivery_address }}</p>
                </div>
                
                <div>
                    <p class="text-sm text-gray-500 mb-1">Recipient</p>
                    <p class="font-semibold">{{ $order->recipient_name }}</p>
                    <p class="text-sm">{{ $order->recipient_phone }}</p>
                </div>
                
                @if($order->package_description)
                <div>
                    <p class="text-sm text-gray-500 mb-1">Package Description</p>
                    <p>{{ $order->package_description }}</p>
                </div>
                @endif
            </div>
        </div>
    </div>
    
    @if($order->driver_id === auth()->id() && $order->status !== 'delivered' && $order->status !== 'cancelled')
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Update Status</h2>
        
        <form action="{{ route('driver.orders.update-status', $order->id) }}" method="POST">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">New Status</label>
                    <select name="status" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        @if($order->status === 'accepted')
                            <option value="picked_up">Picked Up</option>
                        @endif
                        @if($order->status === 'picked_up')
                            <option value="in_transit">In Transit</option>
                        @endif
                        @if($order->status === 'in_transit')
                            <option value="delivered">Delivered</option>
                        @endif
                    </select>
                </div>
                
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Notes (Optional)</label>
                    <input type="text" name="notes" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
            </div>
            
            <div class="mt-4">
                <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
                    Update Status
                </button>
            </div>
        </form>
    </div>
    @endif
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Status History</h2>
        <div class="space-y-3">
            @foreach($order->statusHistories as $history)
            <div class="flex items-start border-l-4 border-primary pl-4 py-2">
                <div class="flex-1">
                    <p class="font-semibold">{{ ucfirst(str_replace('_', ' ', $history->status)) }}</p>
                    <p class="text-sm text-gray-600">{{ $history->notes }}</p>
                    <p class="text-xs text-gray-500">{{ $history->created_at->format('Y-m-d H:i:s') }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>
@endsection

@extends('layouts.app')

@section('title', 'Order Details')

@section('sidebar')
    @include('layouts.admin-sidebar')
@endsection

@section('content')
<div class="container mx-auto">
    <div class="mb-6">
        <a href="{{ route('admin.orders') }}" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-arrow-left"></i> Back to Orders
        </a>
    </div>
    
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Order #{{ $order->id }}</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Order Information</h2>
            
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold
                        @if($order->status === 'pending') bg-yellow-100 text-yellow-800
                        @elseif($order->status === 'delivered') bg-green-100 text-green-800
                        @elseif($order->status === 'cancelled') bg-red-100 text-red-800
                        @else bg-blue-100 text-blue-800
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
                    <p class="text-sm text-gray-500">Driver</p>
                    <p class="font-semibold">{{ $order->driver ? $order->driver->name : 'Not assigned' }}</p>
                    @if($order->driver)
                    <p class="text-sm">{{ $order->driver->phone }}</p>
                    @endif
                </div>
                
                <div>
                    <p class="text-sm text-gray-500">Delivery Fee</p>
                    <p class="font-semibold text-lg">${{ number_format($order->delivery_fee, 2) }}</p>
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
                
                @if($order->notes)
                <div>
                    <p class="text-sm text-gray-500 mb-1">Notes</p>
                    <p>{{ $order->notes }}</p>
                </div>
                @endif
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Status History</h2>
        <div class="space-y-3">
            @foreach($order->statusHistories as $history)
            <div class="flex items-start border-l-4 border-primary pl-4 py-2">
                <div class="flex-1">
                    <p class="font-semibold">{{ ucfirst(str_replace('_', ' ', $history->status)) }}</p>
                    <p class="text-sm text-gray-600">{{ $history->notes }}</p>
                    <p class="text-xs text-gray-500">By {{ $history->user->name }} - {{ $history->created_at->format('Y-m-d H:i:s') }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>
@endsection

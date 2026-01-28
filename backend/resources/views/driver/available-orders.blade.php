@extends('layouts.app')

@section('title', 'Available Orders')

@section('sidebar')
    @include('layouts.driver-sidebar')
@endsection

@section('content')
<div class="container mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Available Orders</h1>
    
    @if($orders->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @foreach($orders as $order)
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="font-bold text-xl">Order #{{ $order->id }}</h3>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                </div>
                
                <div class="space-y-3 mb-4">
                    <div>
                        <p class="text-sm text-gray-500">Customer</p>
                        <p class="font-semibold">{{ $order->customer->name }}</p>
                        <p class="text-sm">{{ $order->customer->phone }}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm text-gray-500 mb-1">
                            <i class="fas fa-map-marker-alt text-green-500"></i> Pickup
                        </p>
                        <p class="text-sm">{{ $order->pickup_address }}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm text-gray-500 mb-1">
                            <i class="fas fa-map-marker-alt text-red-500"></i> Delivery
                        </p>
                        <p class="text-sm">{{ $order->delivery_address }}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm text-gray-500">Delivery Fee</p>
                        <p class="font-bold text-lg text-primary">${{ number_format($order->delivery_fee, 2) }}</p>
                    </div>
                </div>
                
                <div class="flex gap-2">
                    <a href="{{ route('driver.orders.show', $order->id) }}" 
                       class="flex-1 text-center border border-primary text-primary px-4 py-2 rounded-lg hover:bg-gray-50">
                        View Details
                    </a>
                    <form action="{{ route('driver.orders.accept', $order->id) }}" method="POST" class="flex-1">
                        @csrf
                        <button type="submit" class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                            Accept Order
                        </button>
                    </form>
                </div>
            </div>
            @endforeach
        </div>
        
        <div class="mt-6">
            {{ $orders->links() }}
        </div>
    @else
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
            <i class="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
            <p class="text-gray-500 text-lg">No available orders at the moment</p>
        </div>
    @endif
</div>
@endsection

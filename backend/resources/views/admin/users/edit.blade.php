@extends('layouts.app')

@section('title', 'Edit User')

@section('sidebar')
    @include('layouts.admin-sidebar')
@endsection

@section('content')
<div class="container mx-auto max-w-2xl">
    <div class="mb-6">
        <a href="{{ route('admin.users') }}" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-arrow-left"></i> Back to Users
        </a>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
        
        @if($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <ul>
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        
        <form action="{{ route('admin.users.update', $user->id) }}" method="POST">
            @csrf
            @method('PUT')
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
                <input type="text" name="name" id="name" value="{{ old('name', $user->name) }}" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
            </div>
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input type="email" name="email" id="email" value="{{ old('email', $user->email) }}" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
            </div>
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">Phone</label>
                <input type="text" name="phone" id="phone" value="{{ old('phone', $user->phone) }}" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
            </div>
            
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="role">Role</label>
                <select name="role" id="role" required onchange="toggleCommissionFields()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                    <option value="customer" {{ $user->role === 'customer' ? 'selected' : '' }}>Customer (عميل)</option>
                    <option value="driver" {{ $user->role === 'driver' ? 'selected' : '' }}>Driver (سائق)</option>
                    <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin (مدير)</option>
                </select>
            </div>
            
            <div id="commissionFields" style="display: {{ $user->role === 'driver' ? 'block' : 'none' }};">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="pickup_commission_rate">Pickup Commission Rate (%)</label>
                    <input type="number" name="pickup_commission_rate" id="pickup_commission_rate" value="{{ old('pickup_commission_rate', $user->pickup_commission_rate ?? 45) }}" step="0.01" min="0" max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="delivery_commission_rate">Delivery Commission Rate (%)</label>
                    <input type="number" name="delivery_commission_rate" id="delivery_commission_rate" value="{{ old('delivery_commission_rate', $user->delivery_commission_rate ?? 45) }}" step="0.01" min="0" max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="same_driver_commission_rate">Same Driver Commission Rate (%)</label>
                    <input type="number" name="same_driver_commission_rate" id="same_driver_commission_rate" value="{{ old('same_driver_commission_rate', $user->same_driver_commission_rate ?? 70) }}" step="0.01" min="0" max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                </div>
            </div>
            
            <script>
                function toggleCommissionFields() {
                    const role = document.getElementById('role').value;
                    const commissionFields = document.getElementById('commissionFields');
                    commissionFields.style.display = role === 'driver' ? 'block' : 'none';
                }
            </script>
            
            <div class="mb-4">
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" {{ $user->is_active ? 'checked' : '' }} class="mr-2">
                    <span class="text-sm text-gray-700">Active</span>
                </label>
            </div>
            
            <div class="flex justify-end">
                <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
                    Update User
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

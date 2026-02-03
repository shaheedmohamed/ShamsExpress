@extends('layouts.app')

@section('title', 'Withdrawal Request Details')

@section('sidebar')
    @include('layouts.admin-sidebar')
@endsection

@section('content')
<div class="container mx-auto px-4">
    <div class="mb-6">
        <a href="{{ route('admin.withdrawals.index') }}" class="text-blue-600 hover:text-blue-800">
            <i class="fas fa-arrow-left"></i> العودة للقائمة
        </a>
    </div>

    <h1 class="text-3xl font-bold text-gray-800 mb-6">طلب سحب #{{ $request->id }}</h1>

    @if(session('success'))
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ session('success') }}
    </div>
    @endif

    @if(session('error'))
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ session('error') }}
    </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">معلومات المستخدم</h2>
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-500">الاسم</p>
                    <p class="font-semibold">{{ $request->user->name }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p class="font-semibold">{{ $request->user->email }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">الهاتف</p>
                    <p class="font-semibold">{{ $request->user->phone }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">رصيد المحفظة الحالي</p>
                    <p class="font-semibold text-lg text-green-600">{{ number_format($request->user->wallet->balance ?? 0, 2) }} AED</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">تفاصيل الطلب</h2>
            <div class="space-y-3">
                <div>
                    <p class="text-sm text-gray-500">المبلغ المطلوب</p>
                    <p class="font-semibold text-2xl text-blue-600">{{ number_format($request->amount, 2) }} AED</p>
                </div>
                <div>
                    <p class="text-sm text-gray-500">الحالة</p>
                    <span class="px-3 py-1 rounded-full text-sm font-semibold
                        @if($request->status === 'pending') bg-yellow-100 text-yellow-800
                        @elseif($request->status === 'approved') bg-green-100 text-green-800
                        @else bg-red-100 text-red-800
                        @endif">
                        {{ ucfirst($request->status) }}
                    </span>
                </div>
                <div>
                    <p class="text-sm text-gray-500">تاريخ الطلب</p>
                    <p class="font-semibold">{{ $request->created_at->format('Y-m-d H:i:s') }}</p>
                </div>
                @if($request->processed_at)
                <div>
                    <p class="text-sm text-gray-500">تاريخ المعالجة</p>
                    <p class="font-semibold">{{ $request->processed_at->format('Y-m-d H:i:s') }}</p>
                </div>
                @endif
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">المعلومات البنكية</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p class="text-sm text-gray-500">اسم البنك</p>
                <p class="font-semibold">{{ $request->bank_name }}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">اسم صاحب الحساب</p>
                <p class="font-semibold">{{ $request->account_holder_name }}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">رقم الحساب</p>
                <p class="font-semibold">{{ $request->account_number }}</p>
            </div>
            @if($request->iban)
            <div>
                <p class="text-sm text-gray-500">IBAN</p>
                <p class="font-semibold">{{ $request->iban }}</p>
            </div>
            @endif
        </div>
        @if($request->notes)
        <div class="mt-4">
            <p class="text-sm text-gray-500">ملاحظات المستخدم</p>
            <p class="mt-1">{{ $request->notes }}</p>
        </div>
        @endif
    </div>

    @if($request->status === 'pending')
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-green-800 mb-4">الموافقة على الطلب</h2>
            <form action="{{ route('admin.withdrawals.approve', $request->id) }}" method="POST" enctype="multipart/form-data">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">صورة إثبات التحويل *</label>
                    <input type="file" name="transfer_proof" accept="image/*" required
                           class="w-full border border-gray-300 rounded-lg px-4 py-2">
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات الإدارة</label>
                    <textarea name="admin_notes" rows="3" 
                              class="w-full border border-gray-300 rounded-lg px-4 py-2"></textarea>
                </div>
                <button type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    الموافقة وتحويل المبلغ
                </button>
            </form>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-red-800 mb-4">رفض الطلب</h2>
            <form action="{{ route('admin.withdrawals.reject', $request->id) }}" method="POST">
                @csrf
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">سبب الرفض *</label>
                    <textarea name="admin_notes" rows="3" required
                              class="w-full border border-gray-300 rounded-lg px-4 py-2"></textarea>
                </div>
                <button type="submit" class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    رفض الطلب
                </button>
            </form>
        </div>
    </div>
    @endif

    @if($request->status !== 'pending')
    <div class="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">معلومات المعالجة</h2>
        <div class="space-y-3">
            @if($request->processedBy)
            <div>
                <p class="text-sm text-gray-500">تمت المعالجة بواسطة</p>
                <p class="font-semibold">{{ $request->processedBy->name }}</p>
            </div>
            @endif
            @if($request->admin_notes)
            <div>
                <p class="text-sm text-gray-500">ملاحظات الإدارة</p>
                <p class="mt-1">{{ $request->admin_notes }}</p>
            </div>
            @endif
            @if($request->transfer_proof)
            <div>
                <p class="text-sm text-gray-500 mb-2">إثبات التحويل</p>
                <img src="{{ asset('storage/' . $request->transfer_proof) }}" 
                     alt="Transfer Proof" 
                     class="max-w-md rounded-lg shadow-md">
            </div>
            @endif
        </div>
    </div>
    @endif
</div>
@endsection

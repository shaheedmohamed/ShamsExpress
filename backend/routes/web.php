<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\AdminController;
use App\Http\Controllers\Web\DriverController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/users/create', [AdminController::class, 'createUser'])->name('admin.users.create');
    Route::post('/users', [AdminController::class, 'storeUser'])->name('admin.users.store');
    Route::get('/users/{id}/edit', [AdminController::class, 'editUser'])->name('admin.users.edit');
    Route::put('/users/{id}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');
    
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/orders/{id}', [AdminController::class, 'showOrder'])->name('admin.orders.show');
    Route::post('/orders/{id}/assign-driver', [AdminController::class, 'assignDriver'])->name('admin.orders.assign-driver');
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus'])->name('admin.orders.update-status');
    Route::get('/warehouse/products', [AdminController::class, 'warehouseProducts'])->name('admin.warehouse.products');
    Route::post('/warehouse/orders/{id}/assign-driver', [AdminController::class, 'assignWarehouseOrderToDriver'])->name('admin.warehouse.assign-driver');
    
    Route::get('/drivers', [AdminController::class, 'drivers'])->name('admin.drivers');
});

Route::middleware(['auth', 'driver'])->prefix('driver')->group(function () {
    Route::get('/dashboard', [DriverController::class, 'dashboard'])->name('driver.dashboard');
    Route::get('/available-orders', [DriverController::class, 'availableOrders'])->name('driver.available-orders');
    Route::get('/my-orders', [DriverController::class, 'myOrders'])->name('driver.my-orders');
    Route::get('/orders/{id}', [DriverController::class, 'showOrder'])->name('driver.orders.show');
    Route::post('/orders/{id}/accept', [DriverController::class, 'acceptOrder'])->name('driver.orders.accept');
    Route::post('/orders/{id}/update-status', [DriverController::class, 'updateStatus'])->name('driver.orders.update-status');
});

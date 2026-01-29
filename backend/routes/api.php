<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DeliveryOrderController;
use App\Http\Controllers\Api\DriverController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/push-token', [AuthController::class, 'savePushToken']);
    
    Route::get('/orders', [DeliveryOrderController::class, 'index']);
    Route::post('/orders', [DeliveryOrderController::class, 'store']);
    Route::get('/orders/{id}', [DeliveryOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [DeliveryOrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [DeliveryOrderController::class, 'cancel']);
    Route::get('/statistics', [DeliveryOrderController::class, 'statistics']);
    
    Route::get('/driver/dashboard', [DriverController::class, 'dashboard']);
    Route::get('/driver/available-orders', [DriverController::class, 'availableOrders']);
    Route::get('/driver/my-orders', [DriverController::class, 'myOrders']);
    Route::post('/driver/orders/{id}/accept', [DriverController::class, 'acceptOrder']);
    Route::put('/driver/orders/{id}/status', [DriverController::class, 'updateOrderStatus']);
});

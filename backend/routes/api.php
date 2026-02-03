<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DeliveryOrderController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\PricingController;

Route::get('/pricing/shipment-types', [PricingController::class, 'getShipmentTypes']);
Route::get('/pricing/delivery-zones', [PricingController::class, 'getDeliveryZones']);
Route::post('/pricing/calculate', [PricingController::class, 'calculatePrice']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/guest', [AuthController::class, 'continueAsGuest']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/push-token', [AuthController::class, 'updatePushToken']);
    Route::post('/user/addresses', [AuthController::class, 'saveAddress']);
    
    Route::get('/orders', [DeliveryOrderController::class, 'index']);
    Route::post('/orders', [DeliveryOrderController::class, 'store']);
    Route::get('/orders/{id}', [DeliveryOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [DeliveryOrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [DeliveryOrderController::class, 'cancel']);
    Route::get('/statistics', [DeliveryOrderController::class, 'statistics']);
    
    Route::get('/wallet', [WalletController::class, 'getWallet']);
    Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
    Route::get('/wallet/transactions', [WalletController::class, 'getTransactions']);
    Route::post('/wallet/withdraw', [WalletController::class, 'createWithdrawalRequest']);
    Route::get('/wallet/withdrawals', [WalletController::class, 'getWithdrawalRequests']);
    Route::get('/wallet/withdrawals/{id}', [WalletController::class, 'getWithdrawalRequest']);
});

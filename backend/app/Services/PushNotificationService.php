<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    public static function sendOrderStatusNotification($user, $order, $status)
    {
        if (!$user || !$user->push_token) {
            return;
        }

        $statusMessages = [
            'pending' => 'Your order is pending',
            'accepted' => 'Your order has been accepted',
            'picked_up' => 'Your order has been picked up',
            'in_transit' => 'Your order is in transit',
            'delivered' => 'Your order has been delivered',
            'cancelled' => 'Your order has been cancelled',
        ];

        $title = 'Order Update';
        $body = $statusMessages[$status] ?? 'Order status updated';
        $body .= " - Order #{$order->id}";

        try {
            $response = Http::post('https://exp.host/--/api/v2/push/send', [
                'to' => $user->push_token,
                'title' => $title,
                'body' => $body,
                'data' => [
                    'orderId' => $order->id,
                    'status' => $status,
                ],
                'sound' => 'default',
                'priority' => 'high',
            ]);

            if (!$response->successful()) {
                Log::error('Push notification failed', [
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Push notification exception', [
                'user_id' => $user->id,
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

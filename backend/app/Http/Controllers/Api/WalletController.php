<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function getWallet(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet()->with('transactions')->first();

        if (!$wallet) {
            $wallet = $user->wallet()->create([
                'balance' => 0,
                'total_earnings' => 0,
                'total_spent' => 0,
                'pending_amount' => 0,
            ]);
        }

        return response()->json($wallet);
    }

    public function getTransactions(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json([]);
        }

        $transactions = $wallet->transactions()
            ->with('order')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($transactions);
    }

    public function getBalance(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        return response()->json([
            'balance' => $wallet ? $wallet->balance : 0,
            'total_earnings' => $wallet ? $wallet->total_earnings : 0,
            'total_spent' => $wallet ? $wallet->total_spent : 0,
            'pending_amount' => $wallet ? $wallet->pending_amount : 0,
        ]);
    }

    public function createWithdrawalRequest(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'bank_name' => 'required|string',
            'account_holder_name' => 'required|string',
            'account_number' => 'required|string',
            'iban' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet || $wallet->balance < $request->amount) {
            return response()->json([
                'message' => 'Insufficient balance'
            ], 400);
        }

        $withdrawalRequest = WithdrawalRequest::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'bank_name' => $request->bank_name,
            'account_holder_name' => $request->account_holder_name,
            'account_number' => $request->account_number,
            'iban' => $request->iban,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json($withdrawalRequest, 201);
    }

    public function getWithdrawalRequests(Request $request)
    {
        $user = $request->user();
        $requests = $user->withdrawalRequests()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function getWithdrawalRequest(Request $request, $id)
    {
        $user = $request->user();
        $withdrawalRequest = WithdrawalRequest::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($withdrawalRequest);
    }
}

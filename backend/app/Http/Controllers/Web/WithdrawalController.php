<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\WithdrawalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WithdrawalController extends Controller
{
    public function index()
    {
        $requests = WithdrawalRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return view('admin.withdrawals.index', compact('requests'));
    }

    public function show($id)
    {
        $request = WithdrawalRequest::with(['user.wallet', 'processedBy'])
            ->findOrFail($id);

        return view('admin.withdrawals.show', compact('request'));
    }

    public function approve(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'nullable|string',
            'transfer_proof' => 'required|image|max:5120',
        ]);

        $withdrawalRequest = WithdrawalRequest::findOrFail($id);

        if ($withdrawalRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Request already processed');
        }

        $wallet = $withdrawalRequest->user->wallet;
        if ($wallet->balance < $withdrawalRequest->amount) {
            return redirect()->back()->with('error', 'Insufficient balance');
        }

        // Upload transfer proof
        $path = $request->file('transfer_proof')->store('transfer_proofs', 'public');

        // Update wallet
        $wallet->balance -= $withdrawalRequest->amount;
        $wallet->total_spent += $withdrawalRequest->amount;
        $wallet->save();

        // Create transaction
        \App\Models\WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'debit',
            'amount' => $withdrawalRequest->amount,
            'description' => 'Withdrawal request #' . $withdrawalRequest->id,
            'reference_type' => 'withdrawal',
            'reference_id' => $withdrawalRequest->id,
        ]);

        // Update request
        $withdrawalRequest->status = 'approved';
        $withdrawalRequest->transfer_proof = $path;
        $withdrawalRequest->admin_notes = $request->admin_notes;
        $withdrawalRequest->processed_by = auth()->id();
        $withdrawalRequest->processed_at = now();
        $withdrawalRequest->save();

        return redirect()->route('admin.withdrawals.index')->with('success', 'Withdrawal approved successfully');
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $withdrawalRequest = WithdrawalRequest::findOrFail($id);

        if ($withdrawalRequest->status !== 'pending') {
            return redirect()->back()->with('error', 'Request already processed');
        }

        $withdrawalRequest->status = 'rejected';
        $withdrawalRequest->admin_notes = $request->admin_notes;
        $withdrawalRequest->processed_by = auth()->id();
        $withdrawalRequest->processed_at = now();
        $withdrawalRequest->save();

        return redirect()->route('admin.withdrawals.index')->with('success', 'Withdrawal rejected');
    }
}

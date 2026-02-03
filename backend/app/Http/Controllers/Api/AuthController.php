<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'required|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'customer',
        ]);

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated.',
            ], 403);
        }

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function continueAsGuest(Request $request)
    {
        $guestName = 'Guest_' . time();
        $guestEmail = 'guest_' . time() . '@shamsexpress.app';
        $guestPhone = '0000' . rand(100000, 999999);

        $user = User::create([
            'name' => $guestName,
            'email' => $guestEmail,
            'password' => Hash::make(Str::random(32)),
            'phone' => $guestPhone,
            'role' => 'customer',
            'is_guest' => true,
        ]);

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
        ]);

        $user = $request->user();
        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json($user);
    }

    public function updatePushToken(Request $request)
    {
        $request->validate([
            'push_token' => 'required|string',
        ]);

        $user = $request->user();
        $user->update([
            'push_token' => $request->push_token,
        ]);

        return response()->json(['message' => 'Push token updated successfully']);
    }

    public function saveAddress(Request $request)
    {
        $request->validate([
            'address' => 'required|string',
            'label' => 'nullable|string',
        ]);

        $user = $request->user();
        $addresses = $user->saved_addresses ?? [];
        
        // Check if address already exists
        $exists = false;
        foreach ($addresses as $addr) {
            if ($addr['address'] === $request->address) {
                $exists = true;
                break;
            }
        }
        
        if (!$exists) {
            $addresses[] = [
                'address' => $request->address,
                'label' => $request->label ?? 'Saved Address',
            ];
            
            $user->update([
                'saved_addresses' => $addresses,
            ]);
        }

        return response()->json([
            'addresses' => $addresses,
            'message' => 'Address saved successfully',
        ]);
    }

    public function savePushToken(Request $request)
    {
        $request->validate([
            'push_token' => 'required|string',
        ]);

        $user = $request->user();
        $user->push_token = $request->push_token;
        $user->save();

        return response()->json(['message' => 'Push token saved successfully']);
    }

    public function createGuestAccount(Request $request)
    {
        try {
            $guestIdentifier = uniqid('guest_', true);
            $randomEmail = 'guest_' . time() . '_' . rand(1000, 9999) . '@shamsexpress.local';
            $randomPhone = null;

            $user = User::create([
                'name' => 'Guest User',
                'email' => $randomEmail,
                'password' => bcrypt(Str::random(32)),
                'phone' => $randomPhone,
                'role' => 'customer',
                'is_guest' => true,
                'guest_identifier' => $guestIdentifier,
            ]);

            $token = $user->createToken('guest-app')->plainTextToken;

            return response()->json([
                'user' => $user->load('wallet'),
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Guest account creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create guest account',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteAddress(Request $request, $addressId)
    {
        $user = $request->user();
        $addresses = $user->saved_addresses ?? [];

        $addresses = array_filter($addresses, function($addr) use ($addressId) {
            return $addr['id'] !== $addressId;
        });

        $user->saved_addresses = array_values($addresses);
        $user->save();

        return response()->json([
            'message' => 'Address deleted successfully',
            'addresses' => $user->saved_addresses,
        ]);
    }
}

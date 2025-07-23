<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'status' => true,
            'data' => [
                'services' => DB::table('services')->count(),
                'projects' => DB::table('projects')->count(),
                'blogs' => DB::table('blogs')->count(),
                'teams' => DB::table('teams')->count(),
            ]
        ]);
    }

    // Return authenticated user details
    public function profile(Request $request)
    {
        return response()->json([
            'status' => true,
            'data' => $request->user()
        ]);
    }

    // Update authenticated user profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'old_password' => 'nullable|string|min:6',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        // If old_password and new password are provided, attempt password change
        if ($request->filled('old_password') && $request->filled('password')) {
            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Old password is incorrect.',
                ], 422);
            }

            $user->password = Hash::make($request->password);
        }

        // Always update name and email
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }
}

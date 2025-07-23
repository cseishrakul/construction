<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $teams
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:teams,email',
                'phone' => 'required|string',
                'role' => 'required|string',
                'status' => 'required|boolean',
                'image' => 'nullable|string',
                'image_public_id' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ]);
            }

            $team = new Team();
            $team->name = $request->name;
            $team->email = $request->email;
            $team->phone = $request->phone;
            $team->role = $request->role;
            $team->status = $request->status;

            if ($request->filled('image') && $request->filled('image_public_id')) {
                $team->image = $request->image;
                $team->image_public_id = $request->image_public_id;
            }

            $team->save();

            return response()->json([
                'status' => true,
                'message' => 'Team member created successfully!',
                'data' => $team
            ]);
        } catch (\Exception $e) {
            Log::error("Team Store Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function show($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json([
                'status' => false,
                'message' => 'Team member not found!'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $team,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $team = Team::find($id);
            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found!',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:teams,email,' . $id,
                'phone' => 'required|string',
                'role' => 'required|string',
                'status' => 'required|boolean',
                'image' => 'nullable|string',
                'image_public_id' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ]);
            }

            $team->name = $request->name;
            $team->email = $request->email;
            $team->phone = $request->phone;
            $team->role = $request->role;
            $team->status = $request->status;

            // Replace image if new image info is provided
            if ($request->filled('image') && $request->filled('image_public_id')) {
                // Delete old image from Cloudinary safely
                if (!empty($team->image_public_id) && is_string($team->image_public_id)) {
                    try {
                        Cloudinary::destroy($team->image_public_id);
                    } catch (\Exception $ex) {
                        Log::error("Cloudinary deletion error on team update: " . $ex->getMessage());
                    }
                }

                $team->image = $request->image;
                $team->image_public_id = $request->image_public_id;
            }

            $team->save();

            return response()->json([
                'status' => true,
                'message' => 'Team member updated successfully!',
                'data' => $team,
            ]);
        } catch (\Exception $e) {
            Log::error("Team Update Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $team = Team::find($id);
            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found!'
                ], 404);
            }

            if ($team->image_public_id) {
                try {
                    Cloudinary::destroy($team->image_public_id);
                } catch (\Exception $e) {
                    Log::error("Cloudinary deletion error on team destroy: " . $e->getMessage());
                }
            }

            $team->delete();

            return response()->json([
                'status' => true,
                'message' => 'Team member deleted successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error("Team Delete Error: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}

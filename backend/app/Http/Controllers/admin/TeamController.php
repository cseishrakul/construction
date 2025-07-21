<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::orderBy('id', 'desc')->get();
        return response()->json(['status' => true, 'data' => $teams]);
    }

    public function show($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['status' => false, 'message' => 'Team member not found'], 404);
        }
        return response()->json(['status' => true, 'data' => $team]);
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:teams,email',
            'phone' => 'required|string',
            'role' => 'required|string',
            'status' => 'required|boolean',
            'imageId' => 'nullable|integer',
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
        $team->save();

        if (!empty($request->imageId) && $request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $path = public_path('uploads/temp/' . $tempImage->name);

                $cloudinaryUpload = Cloudinary::upload($path, [
                    'folder' => 'teams',
                    'transformation' => [
                        ['width' => 1000, 'crop' => 'limit']
                    ]
                ]);

                $team->image = $cloudinaryUpload->getSecurePath();
                $team->image_public_id = $cloudinaryUpload->getPublicId();
                $team->save();

                $tempImage->delete();
                File::delete($path);
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Team member created successfully!',
            'data' => $team
        ]);
    }


    public function update(Request $request, $id)
    {
        try {
            \Log::info("Update request for team ID: $id", $request->all());

            $team = Team::find($id);
            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found'
                ], 404);
            }

            $validator = \Validator::make($request->all(), [
                'name' => 'required|string',
                'email' => 'required|email|unique:teams,email,' . $id,
                'phone' => 'required|string',
                'role' => 'required|string',
                'status' => 'required|boolean',
                'imageId' => 'nullable|integer',
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

            if (!empty($request->imageId) && $request->imageId > 0) {
                $tempImage = TempImage::find($request->imageId);

                if ($tempImage) {
                    $path = public_path('uploads/temp/' . $tempImage->name);

                    // Remove old from Cloudinary
                    if ($team->image_public_id) {
                        Cloudinary::destroy($team->image_public_id);
                    }

                    $cloudinaryUpload = Cloudinary::upload($path, [
                        'folder' => 'teams',
                        'transformation' => [
                            ['width' => 1000, 'crop' => 'limit']
                        ]
                    ]);

                    $team->image = $cloudinaryUpload->getSecurePath();
                    $team->image_public_id = $cloudinaryUpload->getPublicId();

                    $tempImage->delete();
                    File::delete($path);
                }
            }


            $team->save();

            return response()->json([
                'status' => true,
                'message' => 'Team member updated successfully!',
                'data' => $team
            ]);
        } catch (\Throwable $e) {
            \Log::error("Update error for team ID: $id - " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['status' => false, 'message' => 'Team member not found'], 404);
        }

        if ($team->image) {
            File::delete(public_path('uploads/teams/large/' . $team->image));
            File::delete(public_path('uploads/teams/small/' . $team->image));
        }

        $team->delete();

        return response()->json(['status' => true, 'message' => 'Team member deleted successfully!']);
    }

    private function moveTempImageToTeamFolder($imageId, $teamId)
    {
        $tempImage = TempImage::find($imageId);
        if (!$tempImage) return null;

        $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
        $fileName = time() . '_' . $teamId . '.' . $ext;

        $srcPath = public_path('uploads/temp/' . $tempImage->name);
        $smallDest = public_path('uploads/teams/small/' . $fileName);
        $largeDest = public_path('uploads/teams/large/' . $fileName);

        // Ensure folders exist
        if (!file_exists(dirname($smallDest))) mkdir(dirname($smallDest), 0755, true);
        if (!file_exists(dirname($largeDest))) mkdir(dirname($largeDest), 0755, true);

        $manager = new ImageManager(new Driver());

        // Small
        $image = $manager->read($srcPath);
        $image->coverDown(300, 300);
        $image->save($smallDest);

        // Large
        $image = $manager->read($srcPath);
        $image->scaleDown(1000);
        $image->save($largeDest);

        // Delete original temp
        $tempImage->delete();
        File::delete($srcPath);

        return $fileName;
    }
}

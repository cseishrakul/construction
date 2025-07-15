<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

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
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:teams,email',
            'phone' => 'required|string',
            'role' => 'required|string',
            'status' => 'required|boolean',
            'imageId' => 'nullable|integer',
        ]);

        $team = new Team();
        $team->name = $request->name;
        $team->email = $request->email;
        $team->phone = $request->phone;
        $team->role = $request->role;
        $team->status = $request->status;
        $team->save();

        if ($request->imageId > 0) {
            $imageName = $this->moveTempImageToTeamFolder($request->imageId, $team->id);
            if ($imageName) {
                $team->image = $imageName;
                $team->save();
            }
        }

        return response()->json(['status' => true, 'message' => 'Team member created successfully!', 'data' => $team]);
    }

    public function update(Request $request, $id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['status' => false, 'message' => 'Team member not found'], 404);
        }

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:teams,email,' . $id,
            'phone' => 'required|string',
            'role' => 'required|string',
            'status' => 'required|boolean',
            'imageId' => 'nullable|integer',
        ]);

        $team->name = $request->name;
        $team->email = $request->email;
        $team->phone = $request->phone;
        $team->role = $request->role;
        $team->status = $request->status;

        if ($request->imageId > 0) {
            $oldImage = $team->image;

            $imageName = $this->moveTempImageToTeamFolder($request->imageId, $team->id);
            if ($imageName) {
                $team->image = $imageName;

                if ($oldImage) {
                    File::delete(public_path('uploads/teams/large/' . $oldImage));
                    File::delete(public_path('uploads/teams/small/' . $oldImage));
                }
            }
        }

        $team->save();

        return response()->json(['status' => true, 'message' => 'Team member updated successfully!', 'data' => $team]);
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

<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project as ModelsProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;
use App\Models\TempImage;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = ModelsProject::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }

    public function store(Request $request)
    {
        $request->merge(['slug' => Str::slug($request->slug)]);
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:projects,slug'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $project = new ModelsProject();
        $project->title = $request->title;
        $project->slug = Str::slug($request->slug);
        $project->short_desc = $request->short_desc;
        $project->content = $request->content;
        $project->construction_type = $request->construction_type;
        $project->sector = $request->sector;
        $project->status = $request->status;
        $project->location = $request->location;

        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $project->id . '.' . $ext;

                // Small
                $srcPath = public_path('uploads/temp/' . $tempImage->name);
                $destPath = public_path('uploads/projects/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($destPath);

                // large
                $destPath = public_path('uploads/projects/large/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($destPath);

                $project->image = $fileName;
            }
        }

        $project->save();

        return response()->json([
            'status' => true,
            'message' => 'Project added successfully!'
        ]);
    }

    public function update($id, Request $request)
    {
        $project = ModelsProject::find($id);
        if ($project == null) {
            return response([
                'status' => false,
                'message' => 'Project not found'
            ]);
        }
        $request->merge(['slug' => Str::slug($request->slug)]);
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:projects,slug,' . $id . ',id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $project->title = $request->title;
        $project->slug = Str::slug($request->slug);
        $project->short_desc = $request->short_desc;
        $project->content = $request->content;
        $project->construction_type = $request->construction_type;
        $project->sector = $request->sector;
        $project->status = $request->status;
        $project->location = $request->location;

        if ($request->imageId > 0) {
            $oldImage = $project->image;
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $project->id . '.' . $ext;

                // Small
                $srcPath = public_path('uploads/temp/' . $tempImage->name);
                $destPath = public_path('uploads/projects/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($destPath);

                // large
                $destPath = public_path('uploads/projects/large/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($destPath);

                $project->image = $fileName;
                if ($oldImage != '') {
                    File::delete(public_path('uploads/projects/large/' . $oldImage));
                    File::delete(public_path('uploads/projects/small/' . $oldImage));
                }
            }
        }

        $project->save();

        return response()->json([
            'status' => true,
            'message' => 'Project updated successfully!'
        ]);
    }

    public function show($id)
    {
        $project = ModelsProject::find($id);
        if ($project == null) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found'
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $project
        ]);
    }

    public function destroy($id)
    {
        $project = ModelsProject::find($id);
        if ($project == null) {
            return response()->json([
                'status' => true,
                'message' => 'Project not found!'
            ]);
        }

        File::delete(public_path('uploads/projects/large/' . $project->image));
        File::delete(public_path('uploads/projects/small/' . $project->image));

        $project->delete();
        return response()->json([
            'status' => true,
            'message' => 'Project deleted Successfully!'
        ]);
    }
}

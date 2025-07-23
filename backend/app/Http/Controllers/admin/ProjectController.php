<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project as ModelsProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\TempImage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
        // Normalize slug
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
        $project->slug = $request->slug;
        $project->short_desc = $request->short_desc;
        $project->content = $request->content;
        $project->construction_type = $request->construction_type;
        $project->sector = $request->sector;
        $project->status = $request->status;
        $project->location = $request->location;

        // Cloudinary upload on store
        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage !== null) {
                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                // Upload to Cloudinary
                $uploadResult = Cloudinary::upload($srcPath, [
                    'folder' => 'projects',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME)
                ]);

                $project->image = $uploadResult->getSecurePath();
                $project->image_public_id = $uploadResult->getPublicId();

                // Optionally, delete temp image file after upload (optional)
                // File::delete($srcPath);
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
        if ($project === null) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found'
            ]);
        }

        $request->merge(['slug' => Str::slug($request->slug)]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:projects,slug,' . $id
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $project->title = $request->title;
        $project->slug = $request->slug;
        $project->short_desc = $request->short_desc;
        $project->content = $request->content;
        $project->construction_type = $request->construction_type;
        $project->sector = $request->sector;
        $project->status = $request->status;
        $project->location = $request->location;

        // Cloudinary image replacement on update
        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage !== null) {
                // Delete previous Cloudinary image
                if ($project->image_public_id) {
                    Cloudinary::destroy($project->image_public_id);
                }

                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                $uploadResult = Cloudinary::upload($srcPath, [
                    'folder' => 'projects',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME)
                ]);

                $project->image = $uploadResult->getSecurePath();
                $project->image_public_id = $uploadResult->getPublicId();

                // Optionally, delete temp image file after upload
                // File::delete($srcPath);
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
        if ($project === null) {
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
        if ($project === null) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found!'
            ]);
        }

        // Delete image from Cloudinary if exists
        if ($project->image_public_id) {
            Cloudinary::destroy($project->image_public_id);
        }

        $project->delete();

        return response()->json([
            'status' => true,
            'message' => 'Project deleted Successfully!'
        ]);
    }
}

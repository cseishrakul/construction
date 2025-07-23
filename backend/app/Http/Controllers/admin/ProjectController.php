<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->merge(['slug' => Str::slug($request->slug ?? '')]);

            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'slug' => 'required|unique:projects,slug',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ]);
            }

            $project = new Project();
            $project->title = $request->title;
            $project->slug = $request->slug;
            $project->short_desc = $request->short_desc;
            $project->content = $request->content;
            $project->construction_type = $request->construction_type;
            $project->sector = $request->sector;
            $project->status = $request->status;
            $project->location = $request->location;

            // Set image only if both are provided (from client)
            if ($request->filled('image') && $request->filled('image_public_id')) {
                $project->image = $request->image;
                $project->image_public_id = $request->image_public_id;
            }

            $project->save();

            return response()->json([
                'status' => true,
                'message' => 'Project added successfully!',
            ]);
        } catch (\Exception $e) {
            Log::error("Project Store Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function show($id)
    {
        $project = Project::find($id);
        if ($project === null) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found!'
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $project,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status' => false,
                    'message' => 'Project not found!',
                ]);
            }

            $request->merge([
                'slug' => Str::slug($request->slug ?? $request->title ?? '')
            ]);

            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'slug' => 'required|unique:projects,slug,' . $id,
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

            // Replace image if new image info is provided
            if ($request->filled('image') && $request->filled('image_public_id')) {
                // Delete old image from Cloudinary safely
                if (!empty($project->image_public_id) && is_string($project->image_public_id)) {
                    try {
                        Cloudinary::destroy($project->image_public_id);
                    } catch (\Exception $ex) {
                        Log::error("Cloudinary deletion error on project update: " . $ex->getMessage());
                    }
                }

                $project->image = $request->image;
                $project->image_public_id = $request->image_public_id;
            }

            $project->save();

            return response()->json([
                'status' => true,
                'message' => 'Project updated successfully!',
                'data' => $project,
            ]);
        } catch (\Exception $e) {
            Log::error("Project Update Error: " . $e->getMessage());
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
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'status' => false,
                    'message' => 'Project not found!'
                ], 404);
            }

            if ($project->image_public_id) {
                try {
                    Cloudinary::destroy($project->image_public_id);
                } catch (\Exception $e) {
                    Log::error("Cloudinary deletion error on project destroy: " . $e->getMessage());
                }
            }

            $project->delete();

            return response()->json([
                'status' => true,
                'message' => 'Project deleted successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error("Project Delete Error: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}

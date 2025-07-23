<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Log;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $blogs
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->merge(['slug' => Str::slug($request->slug ?? '')]);

            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'slug' => 'required|unique:blogs,slug',
                'short_desc' => 'nullable|string',
                'content' => 'required',
                'status' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ]);
            }

            $blog = new Blog();
            $blog->title = $request->title;
            $blog->slug = $request->slug;
            $blog->short_desc = $request->short_desc;
            $blog->content = $request->content;
            $blog->status = $request->status;

            // Set image only if both are provided (from client)
            if ($request->filled('image') && $request->filled('image_public_id')) {
                $blog->image = $request->image;
                $blog->image_public_id = $request->image_public_id;
            }

            $blog->save();

            return response()->json([
                'status' => true,
                'message' => 'Blog added successfully!',
                'data' => $blog
            ]);
        } catch (\Exception $e) {
            Log::error("Blog Store Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function show($id)
    {
        $blog = Blog::find($id);
        if ($blog === null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found!'
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $blog,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::find($id);

            if (!$blog) {
                return response()->json([
                    'status' => false,
                    'message' => 'Blog not found!',
                ]);
            }

            $request->merge([
                'slug' => Str::slug($request->slug ?? $request->title ?? '')
            ]);

            $validator = Validator::make($request->all(), [
                'title' => 'required',
                'slug' => 'required|unique:blogs,slug,' . $id,
                'short_desc' => 'nullable|string',
                'content' => 'required',
                'status' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ]);
            }

            $blog->title = $request->title;
            $blog->slug = $request->slug;
            $blog->short_desc = $request->short_desc;
            $blog->content = $request->content;
            $blog->status = $request->status;

            // Replace image if new image info is provided
            if ($request->filled('image') && $request->filled('image_public_id')) {
                // Delete old image from Cloudinary safely
                if (!empty($blog->image_public_id) && is_string($blog->image_public_id)) {
                    try {
                        Cloudinary::destroy($blog->image_public_id);
                    } catch (\Exception $ex) {
                        Log::error("Cloudinary deletion error on blog update: " . $ex->getMessage());
                    }
                }

                $blog->image = $request->image;
                $blog->image_public_id = $request->image_public_id;
            }

            $blog->save();

            return response()->json([
                'status' => true,
                'message' => 'Blog updated successfully!',
                'data' => $blog,
            ]);
        } catch (\Exception $e) {
            Log::error("Blog Update Error: " . $e->getMessage());
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
            $blog = Blog::find($id);

            if (!$blog) {
                return response()->json([
                    'status' => false,
                    'message' => 'Blog not found!'
                ], 404);
            }

            if ($blog->image_public_id) {
                try {
                    Cloudinary::destroy($blog->image_public_id);
                } catch (\Exception $e) {
                    Log::error("Cloudinary deletion error on blog destroy: " . $e->getMessage());
                }
            }

            $blog->delete();

            return response()->json([
                'status' => true,
                'message' => 'Blog deleted successfully!'
            ]);
        } catch (\Exception $e) {
            Log::error("Blog Delete Error: " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }
}

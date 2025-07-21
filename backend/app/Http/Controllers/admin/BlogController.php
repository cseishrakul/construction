<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
        $request->merge(['slug' => Str::slug($request->slug)]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:blogs,slug',
            'short_desc' => 'required',
            'content' => 'required',
            'status' => 'required|boolean'
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
        $blog->save();

        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                $uploadResult = Cloudinary::upload($srcPath, [
                    'folder' => 'blogs',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME)
                ]);

                $blog->image = $uploadResult->getSecurePath();
                $blog->image_public_id = $uploadResult->getPublicId();
                $blog->save();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Blog added successfully!',
            'data' => $blog
        ]);
    }

    public function update($id, Request $request)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ]);
        }

        $request->merge(['slug' => Str::slug($request->slug)]);
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:blogs,slug,' . $id . ',id',
            'short_desc' => 'required',
            'content' => 'required',
            'status' => 'required|boolean'
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

        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage) {
                // Delete old image
                if ($blog->image_public_id) {
                    Cloudinary::destroy($blog->image_public_id);
                }

                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                $uploadResult = Cloudinary::upload($srcPath, [
                    'folder' => 'blogs',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME)
                ]);

                $blog->image = $uploadResult->getSecurePath();
                $blog->image_public_id = $uploadResult->getPublicId();
            }
        }

        $blog->save();

        return response()->json([
            'status' => true,
            'message' => 'Blog updated successfully!'
        ]);
    }

    public function show($id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $blog
        ]);
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);
        if (!$blog) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found!'
            ]);
        }

        if ($blog->image_public_id) {
            Cloudinary::destroy($blog->image_public_id);
        }

        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully!'
        ]);
    }
}

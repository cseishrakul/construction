<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

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

        // ✅ First: Save blog without image to get ID
        $blog = new Blog();
        $blog->title = $request->title;
        $blog->slug = $request->slug;
        $blog->short_desc = $request->short_desc;
        $blog->content = $request->content;
        $blog->status = $request->status;
        $blog->save(); // Now $blog->id is available

        // ✅ Now process image
        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);

            if ($tempImage) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $blog->id . '.' . $ext;

                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                // Small
                $smallDest = public_path('uploads/blogs/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($smallDest);

                // Large
                $largeDest = public_path('uploads/blogs/large/' . $fileName);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($largeDest);

                // ✅ Save blog image
                $blog->image = $fileName;
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
            $oldImage = $blog->image;
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $blog->id . '.' . $ext;

                // Paths
                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                // Small image
                $smallDest = public_path('uploads/blogs/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($smallDest);

                // Large image
                $largeDest = public_path('uploads/blogs/large/' . $fileName);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($largeDest);

                $blog->image = $fileName;

                if ($oldImage != '') {
                    File::delete(public_path('uploads/blogs/large/' . $oldImage));
                    File::delete(public_path('uploads/blogs/small/' . $oldImage));
                }
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

        File::delete(public_path('uploads/blogs/large/' . $blog->image));
        File::delete(public_path('uploads/blogs/small/' . $blog->image));

        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully!'
        ]);
    }
}

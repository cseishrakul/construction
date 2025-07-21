<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $services
        ]);
    }

    public function store(Request $request)
    {
        $request->merge(['slug' => Str::slug($request->slug)]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:services,slug'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $model = new Service();
        $model->title = $request->title;
        $model->short_desc = $request->short_desc;
        $model->slug = Str::slug($request->slug);
        $model->content = $request->content;
        $model->status = $request->status;
        $model->price = $request->price;
        $model->details = $request->details;
        $model->budget = $request->budget;
        $model->timeline = $request->timeline;

        // ✅ Upload image to Cloudinary
        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $srcPath = public_path('uploads/temp/' . $tempImage->name);
                $uploadedFile = Cloudinary::upload($srcPath, [
                    'folder' => 'services',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME),
                    'overwrite' => true
                ]);

                // Save secure URL + public ID for deletion
                $model->image = $uploadedFile->getSecurePath();
                $model->image_public_id = $uploadedFile->getPublicId();

                // Optional cleanup
                @unlink($srcPath);
                $tempImage->delete();
            }
        }

        $model->save();

        return response()->json([
            'status' => true,
            'message' => 'Service added successfully!'
        ]);
    }

    public function show($id)
    {
        $service = Service::find($id);
        if ($service == null) {
            return response()->json([
                'status' => false,
                'message' => 'Service not found!'
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $service,
        ]);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if ($service == null) {
            return response()->json([
                'status' => false,
                'errors' => 'Service not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'slug' => 'required|unique:services,slug,' . $id
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ]);
        }

        $service->title = $request->title;
        $service->short_desc = $request->short_desc;
        $service->slug = Str::slug($request->slug);
        $service->content = $request->content;
        $service->status = $request->status;
        $service->price = $request->price;
        $service->details = $request->details;
        $service->budget = $request->budget;
        $service->timeline = $request->timeline;

        // ✅ Update image
        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $srcPath = public_path('uploads/temp/' . $tempImage->name);

                // ❌ Delete old Cloudinary image if exists
                if ($service->image_public_id) {
                    Cloudinary::destroy($service->image_public_id);
                }

                $uploadedFile = Cloudinary::upload($srcPath, [
                    'folder' => 'services',
                    'public_id' => pathinfo($tempImage->name, PATHINFO_FILENAME),
                    'overwrite' => true
                ]);

                $service->image = $uploadedFile->getSecurePath();
                $service->image_public_id = $uploadedFile->getPublicId();

                // Clean temp
                @unlink($srcPath);
                $tempImage->delete();
            }
        }

        $service->save();

        return response()->json([
            'status' => true,
            'message' => 'Service updated successfully!'
        ]);
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        if ($service == null) {
            return response()->json([
                'status' => false,
                'message' => 'Service not found!'
            ]);
        }

        // ❌ Delete from Cloudinary
        if ($service->image_public_id) {
            Cloudinary::destroy($service->image_public_id);
        }

        $service->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service deleted successfully!'
        ]);
    }
}

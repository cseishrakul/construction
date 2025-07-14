<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\File;

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


        if ($request->imageId > 0) {
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $model->id . '.' . $ext;

                // Small
                $srcPath = public_path('uploads/temp/' . $tempImage->name);
                $destPath = public_path('uploads/services/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($destPath);

                // large
                $destPath = public_path('uploads/services/large/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($destPath);

                $model->image = $fileName;
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
                'status' => true,
                'message' => 'Service not found!'
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $service,
        ]);
    }
    public function edit(Service $service)
    {
        //
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
            'slug' => 'required|unique:services,slug,' . $id . ',id'
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


        if ($request->imageId > 0) {
            $oldImage = $service->image;
            $tempImage = TempImage::find($request->imageId);
            if ($tempImage != null) {
                $extArray = explode('.', $tempImage->name);
                $ext = last($extArray);
                $fileName = strtotime('now') . $service->id . '.' . $ext;

                // Small
                $srcPath = public_path('uploads/temp/' . $tempImage->name);
                $destPath = public_path('uploads/services/small/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->coverDown(500, 600);
                $image->save($destPath);

                // large
                $destPath = public_path('uploads/services/large/' . $fileName);
                $manager = new ImageManager(Driver::class);
                $image = $manager->read($srcPath);
                $image->scaleDown(1200);
                $image->save($destPath);

                $service->image = $fileName;
                if ($oldImage != '') {
                    File::delete(public_path('uploads/services/large/' . $oldImage));
                    File::delete(public_path('uploads/services/small/' . $oldImage));
                }
            }
        }

        $service->save();

        return response()->json([
            'status' => true,
            'message' => 'Service Updated successfully!'
        ]);
    }
    public function destroy($id)
    {
        $service = Service::find($id);
        if ($service == null) {
            return response()->json([
                'status' => true,
                'message' => 'Service not found!'
            ]);
        }

        File::delete(public_path('uploads/services/large/' . $service->image));
        File::delete(public_path('uploads/services/small/' . $service->image));
        $service->delete();
        return response()->json([
            'status' => true,
            'message' => 'Service deleted Successfully!'
        ]);
    }
}

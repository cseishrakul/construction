<?php

use App\Http\Controllers\admin\DashboardController;
use App\Http\Controllers\admin\ProjectController;
use App\Http\Controllers\admin\ServiceController;
use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\front\ContactController;
use App\Http\Controllers\front\ProjectController as FrontProjectController;
use App\Http\Controllers\front\ServiceController as FrontServiceController;
use App\Http\Controllers\front\BlogController as FrontBlogController;
use App\Http\Controllers\front\TeamController as FrontTeamController;
use App\Http\Controllers\TempImageController;
use App\Http\Controllers\admin\BlogController;
use App\Http\Controllers\admin\TeamController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('authenticate', [AuthenticationController::class, 'authenticate']);


// Protected Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::get('logout', [AuthenticationController::class, 'logout']);
    // Service Routes for admin dashboard
    Route::post('services', [ServiceController::class, 'store']);
    Route::get('services', [ServiceController::class, 'index']);
    Route::put('services/{id}', [ServiceController::class, 'update']);
    Route::get('services/{id}', [ServiceController::class, 'show']);
    Route::delete('services/{id}', [ServiceController::class, 'destroy']);
    // Temp Image route
    Route::post('temp-images', [TempImageController::class, 'store']);

    // Porjects Route
    Route::post('projects', [ProjectController::class, 'store']);
    Route::get('projects', [ProjectController::class, 'index']);
    Route::put('projects/{id}', [ProjectController::class, 'update']);
    Route::get('projects/{id}', [ProjectController::class, 'show']);
    Route::delete('projects/{id}', [ProjectController::class, 'destroy']);

    // Blog Routes
    Route::apiResource('blogs', BlogController::class);
    Route::apiResource('teams', TeamController::class);

     Route::get('dashboard-stats', [DashboardController::class, 'stats']);

    Route::get('profile', [DashboardController::class, 'profile']);

    Route::put('profile', [DashboardController::class, 'updateProfile']);
});

// Services routes for frontend
Route::get('get-services', [FrontServiceController::class, 'index']);
Route::get('get-latest-services', [FrontServiceController::class, 'latestServices']);
Route::get('/services/{id}', [ServiceController::class, 'show']);

// Project routes for frontend
Route::get('get-projects', [FrontProjectController::class, 'index']);
Route::get('get-latest-projects', [FrontProjectController::class, 'latestProjects']);
Route::get('/projects/{id}', [FrontProjectController::class, 'show']);

// Contact Route
Route::post('contact-now', [ContactController::class, 'index']);


// Blog and team
Route::get('get-blogs', [FrontBlogController::class, 'index']);
Route::get('blogs/{id}', [FrontBlogController::class, 'show']);

// Teams for frontend
Route::get('get-teams', [FrontTeamController::class, 'index']);

<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Team;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $teams
        ]);
    }
}


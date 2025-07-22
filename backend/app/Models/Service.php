<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_desc',
        'content',
        'price',
        'details',
        'budget',
        'timeline',
        'status',
        'image',
        'image_public_id',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
     // Esto permite que estos campos se llenen automáticamente
    protected $fillable = ['nombre', 'precio','stock'];

    
}





<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//agrego el controlador de product
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Esto crea todas las rutas (GET, POST, PUT, DELETE) en una sola línea
Route::apiResource('productos', ProductController::class);
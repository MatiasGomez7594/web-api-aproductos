<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//agrego el controlador de product
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;

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


// Cambia 'auth' por 'auth:sanctum'
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // ... tus rutas de admin
        // Solo el admin ve la gestión de usuarios
    Route::get('/admin/usuarios', [ProfileController::class, 'index']);
    
    // Solo el admin puede borrar productos
    Route::delete('/productos/{id}', [ProductController::class, 'destroy']);
    
    // Solo el admin puede editar precios
    Route::put('/productos/{id}', [ProductController::class, 'update']);
});
/*
Route::get('/productos', [ProductController::class, 'index'])->middleware('auth:sanctum');
// Rutas protegidas: Solo los admins pueden entrar aquí
Route::middleware(['auth', 'admin'])->group(function () {
    
    // Solo el admin ve la gestión de usuarios
    Route::get('/admin/usuarios', [ProfileController::class, 'index']);
    
    // Solo el admin puede borrar productos
    Route::delete('/productos/{id}', [ProductController::class, 'destroy']);
    
    // Solo el admin puede editar precios
    Route::put('/productos/{id}', [ProductController::class, 'update']);
});
*/

// Rutas públicas o de otros roles
//Route::get('/productos', [ProductController::class, 'index'])->middleware('auth');
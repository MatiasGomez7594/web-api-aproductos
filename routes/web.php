<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product; 

// --- RUTAS PÚBLICAS ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- RUTA DASHBOARD (UNIFICADA) ---
// Agrupamos todo lo que necesita el Dashboard aquí
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'productos' => Product::all(), // Traemos los productos de la DB
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// --- RUTAS DE PERFIL ---
Route::middleware('auth')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::post('/productos', [App\Http\Controllers\ProductController::class, 'store'])
    ->middleware(['auth', 'verified']);

Route::delete('/productos/{id}', [App\Http\Controllers\ProductController::class, 'destroy'])
    ->middleware(['auth', 'verified'])
    ->name('productos.destroy');

// routes/web.php
Route::put('/productos/{id}', [App\Http\Controllers\ProductController::class, 'update'])
    ->name('productos.update');
require __DIR__.'/auth.php';
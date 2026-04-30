<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product; 
use App\Http\Controllers\ProductController;

// --- RUTAS PÚBLICAS ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// --- RUTAS DE PERFIL ---
Route::middleware('auth')->group(function () {
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


    // routes/web.php

// El Dashboard lo ven todos los logueados
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'productos' => Product::all(), // Traemos los productos para el carrito
        'mediosPago' => App\Models\MedioPago::all(),

    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

// SOLO EL ADMIN puede crear, editar o borrar
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/productos', [ProductController::class, 'store']);
    Route::put('/productos/{id}', [ProductController::class, 'update']);
    Route::delete('/productos/{id}', [ProductController::class, 'destroy']);
});


// routes/web.php
use App\Http\Controllers\SaleController;

//RUTAS PARA EL VENDEDOR
Route::middleware(['auth'])->group(function () {
    // Agregamos esta línea para que Laravel "escuche" la petición /ventas
    Route::post('/ventas', [SaleController::class, 'store'])->name('ventas.store');
});

Route::get('/buscar-cliente', [SaleController::class, 'buscarCliente']);

require __DIR__.'/auth.php';
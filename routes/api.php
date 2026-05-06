<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
//agrego el controlador de product
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\VentaApiController;
//para el login del usuario desde una app externa
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
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

// Esta ruta será accesible en: /api/confirmar-pedido

Route::get('catalogo', [ProductController::class, 'indexApi']);

//Route::post('/confirmar-pedido', [VentaApiController::class, 'store']);
// Solo usuarios con token pueden entrar aquí
Route::middleware('auth:sanctum')->post('/confirmar-pedido', [VentaApiController::class, 'store']);





Route::post('/login-externo', function (Request $request) {
    // Validar que lleguen los datos
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    // Verificar si el usuario existe y la contraseña es correcta
    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Las credenciales son incorrectas.'
        ], 401);
    }

    // CREAR EL TOKEN
    // El nombre 'token-cliente' es solo una etiqueta interna
    $token = $user->createToken('token-cliente')->plainTextToken;

    return response()->json([
        'status' => 'success',
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);
});


//para registrarse desde una  app externa
Route::post('/registro-externo', function (Request $request) {
    // 1. Validar los datos
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed', // 'confirmed' busca un campo password_confirmation
    ]);

    // 2. Crear el usuario
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    // 3. Generar token para entrar directo
    $token = $user->createToken('token-cliente')->plainTextToken;

    return response()->json([
        'status' => 'success',
        'token' => $token,
        'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email
    ]
    ], 201);
});
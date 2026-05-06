<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    // Obtenemos todos los productos de la base de datos
        $productos = Product::all();
     // ¡IMPORTANTE! Debes retornar los datos
        return response()->json($productos);
    }
    
    /**
     * Store a newly created resource in storage.
     */
// App/Http/Controllers/ProductController.php
public function store(Request $request)
{
    // 1. Validamos los datos
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric|min:1',
        'stock'  => 'required|integer|min:1',
    ]);

    // 2. Creamos el producto
    \App\Models\Product::create($validated);

    // 3. Redireccionamos (Inertia refrescará los datos automáticamente)
    return redirect()->back();
}


    /**
     * Display the specified resource.
     */
public function show($id)
{
    // Buscamos el producto por el ID que viene en la URL
    $product = Product::find($id);

    // Si no existe, devolvemos un error 404
    if (!$product) {
        return response()->json(['error' => 'Producto no encontrado'], 404);
    }

    // Si existe, lo devolvemos
    return response()->json($product);
}
    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric|min:1',
            'stock'  => 'required|integer|min:1',
        ]);

        $producto = \App\Models\Product::findOrFail($id);
        $producto->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $producto = \App\Models\Product::findOrFail($id);
        $producto->delete();

        return redirect()->back();
    }


//esto es para usar la api desde un servidor externo
public function indexApi()
{
    // Obtenemos los productos
    $productos = \App\Models\Product::where('stock', '>', 0)->get();

    // Devolvemos JSON puro para que el HTML/JS externo lo entienda
    return response()->json([
        'status' => 'success',
        'data' => $productos
    ], 200);
}

    
}

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
    
    public function store(Request $request)
    {
        $producto = Product::create($request->all());
        // Devolvemos el producto creado con el código 201
        return response()->json($producto, 201);
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
        //
         // Buscamos el producto por el ID que viene en la URL
        $product = Product::find($id);
            // Si no existe, devolvemos un error 404
        if (!$product) {
        return response()->json(['error' => 'Producto no encontrado'], 404);
        }
        // 3. Actualizamos con los datos que vienen en el Request
        $product->update($request->all());

        // 4. Devolvemos el producto ya actualizado
        return response()->json([
            'mensaje' => 'Producto actualizado con éxito',
            'producto' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // destroy() devuelve el número de filas eliminadas (0 o 1)
        $filasEliminadas = Product::destroy($id);

        if ($filasEliminadas === 0) {
            return response()->json(['error' => 'El producto no existe o ya fue eliminado'], 404);
        }

        return response()->json(['exito' => 'Producto eliminado'], 200);
    }

    
}

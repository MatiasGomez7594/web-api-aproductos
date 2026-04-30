<?php
/*



    public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'cantidad' => 'required|integer|min:1',
        'medio_pago_id' => 'required|exists:medios_pago,id',
        'cliente_id'

    ]);

    $producto = \App\Models\Product::findOrFail($request->product_id);

    // Verificar si hay stock suficiente
    if ($producto->stock < $request->cantidad) {
        return back()->withErrors(['cantidad' => 'No hay suficiente stock.']);
    }
        
    $cliente = \App\Models\User::findOrFail($request->cliente_id);
    if($cliente){
    // 1. Registrar la venta con cliente registrado
    \App\Models\Sale::create([
        'product_id' => $producto->id,
        'cliente_id' => $cliente->id,
        //si está registrado se aplica 10% de descuento
        'monto' => $producto->precio*.9 * $request->cantidad,
        'fecha_venta' => now(), // Fecha actual
    ]);

    }
    else{
    // 2. Registrar la venta sin cliente registrado
    \App\Models\Sale::create([
        'product_id' => $producto->id,
        'monto' => $producto->precio * $request->cantidad,
        'fecha_venta' => now(), // Fecha actual
    ]);

    }

    // 2. Restar el stock
    $producto->decrement('stock', $request->cantidad);

    return redirect()->back();
}
}
*/
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;

class SaleController extends Controller
{

public function store(Request $request)
{
    // 1. Validar la entrada
    $request->validate([
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.cantidad' => 'required|integer|min:1',
        'medio_pago_id' => 'required|exists:medio_pagos,id',
        'cliente_id' => 'nullable|exists:users,id', // El ID del cliente que buscaste por email
    ]);

    return DB::transaction(function () use ($request) {
        // 2. Crear la Cabecera de la Venta
        $venta = Sale::create([
            'cliente_id' => $request->cliente_id,
            'medio_pago_id' => $request->medio_pago_id,
            'monto' => 0, // Lo calcularemos sumando los detalles
            'fecha_venta' => now(),
        ]);

        $montoTotalVenta = 0;

        // 3. Procesar cada ítem del "carrito"
        foreach ($request->items as $item) {
            $producto = Product::lockForUpdate()->find($item['product_id']);

            // Validar Stock
            if ($producto->stock < $item['cantidad']) {
                throw new \Exception("Stock insuficiente para: {$producto->nombre}");
            }

            $subtotal = $producto->precio * $item['cantidad'];

            // Crear el detalle
            SaleDetail::create([
                'sale_id' => $venta->id,
                'product_id' => $producto->id,
                'cantidad' => $item['cantidad'],
                'monto' => $subtotal, // Precio histórico del ítem
            ]);

            // Restar stock
            $producto->decrement('stock', $item['cantidad']);
            
            $montoTotalVenta += $subtotal;
        }

        // 4. Actualizar el monto final en la cabecera
        $venta->update(['monto' => $montoTotalVenta]);

        return redirect()->back()->with('success', 'Venta realizada con éxito');
    });
    }


// para buscar un cliente, tambien lo podria poner en UserController con axios
/*
public function buscarCliente(Request $request)
{
    $email = $request->query('email');
    $cliente = \App\Models\User::where('email', $email)->first();

    if ($cliente) {
        return response()->json([
            'id' => $cliente->id,
            'name' => $cliente->name,
        ]);
    }

    return response()->json(null); // No se encontró, cliente_id será null
}

*/
public function buscarCliente(Request $request)
{
    $cliente = \App\Models\User::where('email', $request->email)->first();
    // Devolvemos JSON para que fetch lo entienda
    return response()->json($cliente); 
}

}
?>
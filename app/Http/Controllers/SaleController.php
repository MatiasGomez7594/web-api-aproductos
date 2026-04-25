<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'cantidad' => 'required|integer|min:1',
    ]);

    $producto = \App\Models\Product::findOrFail($request->product_id);

    // Verificar si hay stock suficiente
    if ($producto->stock < $request->cantidad) {
        return back()->withErrors(['cantidad' => 'No hay suficiente stock.']);
    }

    // 1. Registrar la venta
    \App\Models\Sale::create([
        'product_id' => $producto->id,
        'cantidad' => $request->cantidad,
        'monto' => $producto->precio * $request->cantidad,
        'fecha_venta' => now(), // Fecha actual
    ]);

    // 2. Restar el stock
    $producto->decrement('stock', $request->cantidad);

    return redirect()->back();
}
}

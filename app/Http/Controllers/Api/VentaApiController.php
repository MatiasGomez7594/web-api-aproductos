<?php namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaApiController extends Controller
{
    public function store(Request $request)
    {
        // El request traerá { cliente_id: 1, items: [...] }
        
        return DB::transaction(function () use ($request) {
            // 1. Crear la cabecera de la venta
            $venta = Sale::create([
                'cliente_id' => $request->cliente_id ?? 1, // Un ID por defecto si no está logueado
                'medio_pago_id' => $request->medio_pago_id ?? 1,
                'monto' => $request->total,
                'fecha_venta' => now(),
            ]);

            // 2. Guardar cada producto del carrito
            foreach ($request->items as $item) {
                // 2. Doble verificación de stock por seguridad
            $producto = Product::lockForUpdate()->find($item['id']);

            if ($producto->stock < $item['cantidad']) {
                throw new \Exception("Stock insuficiente para: " . $producto->nombre);
            }

            // 3. Restar stock
            $producto->decrement('stock', $item['cantidad']);
                SaleDetail::create([
                    'sale_id' => $venta->id,
                    'product_id' => $item['id'],
                    'cantidad' => $item['cantidad'],
                    'monto' => $item['precio'] * $item['cantidad'],
                ]);


            }

            return response()->json([
                'message' => '¡Pedido recibido con éxito!',
                'venta_id' => $venta->id
            ], 201);
        });
    }
}
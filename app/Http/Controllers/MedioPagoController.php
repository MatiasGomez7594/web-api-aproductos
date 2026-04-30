<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use app\Models\MedioPago;

class MedioPagoController extends Controller
{
    //
    public function index()
    {
    // Obtenemos todos los productos de la base de datos
        $mediosPago = MedioPago::all();
     // ¡IMPORTANTE! Debes retornar los datos
        return response()->json($mediosPago);
    }
        // Tip extra: Relación con la venta
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}

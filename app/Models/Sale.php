<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    // Agregamos las columnas que Laravel tiene permitido llenar
    protected $fillable = [
        'product_id',
        'cantidad',
        'monto',
        'fecha_venta',
    ];
    
    // Tip extra: Relación con el producto
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}



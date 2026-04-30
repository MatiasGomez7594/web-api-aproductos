<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    // Agregamos las columnas que Laravel tiene permitido llenar
    protected $fillable = [
        'cliente_id',
        'monto',
        'fecha_venta',
        'medio_pago_id'
    ];
    
    // Tip extra: Relación con el producto
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
        // Tip extra: Relación con el producto


    public function details() {
        return $this->hasMany(SaleDetail::class);
    }

    public function medioPago() {
        return $this->belongsTo(MedioPago::class);
    }

    public function cliente() {
        return $this->belongsTo(User::class, 'cliente_id'); 
    }
}



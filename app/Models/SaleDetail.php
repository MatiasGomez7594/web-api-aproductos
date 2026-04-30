<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    use HasFactory;

    // Agregamos las columnas que Laravel tiene permitido llenar
    // Esto le dice a Laravel que no busque las columnas created_at y updated_at
        public $timestamps = false;


    protected $fillable = ['sale_id', 'product_id', 'cantidad', 'monto'];

    public function product() {
        return $this->belongsTo(Product::class);
    }


}

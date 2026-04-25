<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            //
            $table->foreignId('medio_pago_id')
          ->nullable() 
          ->constrained('medios_pago')
          ->onDelete('restrict'); // Evita borrar un medio de pago si ya tiene ventas asociadas
        });
    }
        public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            //
            $table->dropColumn('medio_pago_id');

        });
    }
};

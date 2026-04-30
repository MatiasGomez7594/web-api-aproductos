<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('sales_details', function (Blueprint $table) {
            // Aquí eliminamos la columna si decidimos deshacer la migración
            $table->dropColumn('medio_pago_id');
        });
    }
};

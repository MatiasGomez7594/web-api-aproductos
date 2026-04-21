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
        Schema::table('products', function (Blueprint $table) {
            //
            $table->integer('stock'); 

        });
    }

    /**
     * Reverse the migrations.
     */
public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Aquí eliminamos la columna si decidimos deshacer la migración
            $table->dropColumn('stock');
        });
    }
};

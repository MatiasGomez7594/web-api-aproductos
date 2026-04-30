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
        schema::table('sales',function(blueprint $table){
            $table->foreignId('cliente_id')
            ->nullable()               // 1. Primero permitir que sea nulo
            ->searchable()             // (Opcional) Ayuda si tenés miles de clientes
            ->constrained('users')     // 2. Especificar que la tabla es 'users'
            ->onDelete('set null');    // 3. Recomendado para ventas
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

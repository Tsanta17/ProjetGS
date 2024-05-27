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
        Schema::create('livraisons', function (Blueprint $table) {
            $table->id('livraison_id');
            $table->unsignedBigInteger('commande_id');
            $table->date('date_livraison')->nullable();
            $table->string('numero_lot');
            $table->unsignedInteger('quantite');
            $table->timestamps();
            $table->unsignedBigInteger('site_id');

            // Définir les clés étrangères
            $table->foreign('commande_id')->references('commande_id')->on('commandes')->onDelete('cascade');
            $table->foreign('site_id')->references('site_id')->on('sites')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};

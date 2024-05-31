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
        Schema::create('commande_lignes', function (Blueprint $table) {
            $table->id('lignes_id');
            $table->unsignedBigInteger('commande_id')->nullable();
            $table->unsignedBigInteger('article_id')->nullable();
            $table->unsignedInteger('quantite')->nullable();
            $table->unsignedDecimal('prix_unitaire')->nullable();
            $table->string('statut')->nullable();
            $table->timestamps();

            // Définir les clés étrangères
            $table->foreign('commande_id')->references('commande_id')->on('commandes')->onDelete('cascade');
            $table->foreign('article_id')->references('article_id')->on('articles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commande_lignes');
    }
};

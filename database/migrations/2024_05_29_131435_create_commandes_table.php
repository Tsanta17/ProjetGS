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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id('commande_id');
            $table->unsignedBigInteger('fournisseur_id')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->date('date_commande')->nullable();
            $table->string('reference_article')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('statut')->nullable();
            $table->boolean('abonnement')->default(false);
            $table->unsignedBigInteger('budget_disponible')->nullable();
            $table->timestamps();

            // // Définir les clés étrangères
            $table->foreign('fournisseur_id')->references('fournisseur_id')->on('fournisseurs')->onDelete('cascade');
            $table->foreign('site_id')->references('site_id')->on('sites')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};

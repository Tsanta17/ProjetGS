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
        Schema::create('articles', function (Blueprint $table) {
            $table->id('article_id');
            $table->string('reference');
            $table->string('nom_article');
            $table->text('description')->nullable();
            $table->date('date_peremption')->nullable();
            $table->boolean('stock_central')->default(false);
            $table->unsignedBigInteger('fournisseur_id');
            $table->boolean('actif')->default(true);
            $table->boolean('alerte_peremption')->default(false);
            $table->unsignedBigInteger('site_id');
            $table->timestamps();

            // Définir les clés étrangères
            $table->foreign('fournisseur_id')->references('fournisseur_id')->on('fournisseurs')->onDelete('cascade');
            $table->foreign('site_id')->references('site_id')->on('sites')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

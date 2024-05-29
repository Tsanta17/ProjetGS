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
            $table->string('reference')->nullable();
            $table->string('nom_article')->nullable();
            $table->text('description')->nullable();
            $table->date('date_peremption')->nullable();
            $table->unsignedBigInteger('fournisseur_id')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
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
        Schema::dropIfExists('articles');
    }
};

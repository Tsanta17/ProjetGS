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
        Schema::create('affectations', function (Blueprint $table) {
            $table->id('affectation_id');
            $table->unsignedBigInteger('quantite')->nullable();
            $table->date('date_affectation')->nullable();
            $table->unsignedBigInteger('article_id')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('departement')->nullable();
            $table->timestamps();

            // Définir les clés étrangères
            $table->foreign('article_id')->references('article_id')->on('articles')->onDelete('cascade');
            $table->foreign('site_id')->references('site_id')->on('sites')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};

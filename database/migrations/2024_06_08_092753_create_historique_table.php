<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('historiques', function (Blueprint $table) {
            $table->id(); // Clé primaire
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('article_id'); // Colonne pour la clé étrangère
            $table->string('action');
            $table->text('description')->nullable();
            $table->timestamps();

            // Définir la clé étrangère
            $table->foreign('article_id')->references('article_id')->on('articles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('historiques');
    }
};

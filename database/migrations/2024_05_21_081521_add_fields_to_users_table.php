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
        Schema::table('users', function (Blueprint $table) {
            //add role column
            $table->enum('role', ['admin', 'manager', 'user'])->after('password');
            $table->enum('site', ['Ploufragan', 'Quimper', 'Brest', 'Fougeres', 'Combourg'])->after('role');
            $table->boolean('approved')->default(false)->after('site');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            $table->dropColumn('site');
            $table->dropColumn('approved');
        });
    }
};

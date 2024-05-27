<?php

use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ProfileController;
use App\Models\Fournisseur;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__ . '/auth.php';
//Fournisseur
Route::get('/fournisseur', [FournisseurController::class, 'index'])->name('fournisseur.index');
Route::post('/fournisseur/create', [FournisseurController::class, 'store'])->name('fournisseur.store');
Route::get('/fournisseur/{fournisseur}/show', [FournisseurController::class, 'show'])->name('fournisseur.show');
Route::post('/fournisseur/{fournisseur}/update', [FournisseurController::class, 'update'])->name('fournisseur.update');
Route::get('/fournisseur/{fournisseur}/edit', [FournisseurController::class, 'edit'])->name('fournisseur.edit');
Route::get('/fournisseur/list', [FournisseurController::class, 'listeFournisseur'])->name('fournisseurList');

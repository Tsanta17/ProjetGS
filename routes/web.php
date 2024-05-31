<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


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
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {

    //DASHBOARD
    Route::get('/dashboard', function () {
        $fournisseur = session('nombreFournisseurs', 0);
        $article = session('nombreArticles', 0);
        $cout = session('coutArticles', 0);
        $commandeParMois = session('commande_par_mois', []);
        $budgetTotalParMois = session('budget_total_par_mois', []);

        // logger()->info('Session:', ['nombreFournisseurs' => $fournisseur]);
        return Inertia::render('Dashboard', [
            'fournisseurs' => $fournisseur,
            'articles' => $article,
            'couts' => $cout,
            'commandeParMois' => $commandeParMois,
            'budgetTotalParMois' => $budgetTotalParMois,
        ]);
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //ARTICLES
    Route::get('/articles', [ArticleController::class, 'create']);
    Route::post('/ajoutArticle', [ArticleController::class, 'store']);
    Route::get('/editArticle/{id}', [ArticleController::class, 'edit']);
    Route::post('/updateArticle/{id}', [ArticleController::class, 'update']);
    Route::get('/destroyArticle/{id}', [ArticleController::class, 'destroy']);

    //SERVICES
    Route::get('/services', [ServiceController::class, 'create']);
    Route::post('/ajoutCommande', [ServiceController::class, 'store']);
});

require __DIR__ . '/auth.php';
//Fournisseur
Route::get('/fournisseur', [FournisseurController::class, 'index'])->name('fournisseur.index');
Route::post('/fournisseur/create', [FournisseurController::class, 'store'])->name('fournisseur.store');
Route::get('/fournisseur/{fournisseur}/show', [FournisseurController::class, 'show'])->name('fournisseur.show');
Route::post('/fournisseur/{fournisseur}/update', [FournisseurController::class, 'update'])->name('fournisseur.update');
Route::get('/fournisseur/{fournisseur}/edit', [FournisseurController::class, 'edit'])->name('fournisseur.edit');
Route::get('/fournisseur/list', [FournisseurController::class, 'listeFournisseur'])->name('fournisseurList');

//Commande
Route::get('/commande', [CommandeController::class, 'commandeEnAttente'])->name('commande.index');
Route::get('/commande/site', [CommandeController::class, 'commandeParSite'])->name('commande.site');
Route::get('/commande/details/{commande}', [CommandeController::class, 'detailCommande'])->name('commande.detail');
Route::patch('/commande/valider/{commande}', [CommandeController::class, 'validateCommande'])->name('commande.valider');
Route::patch('/commande/mettre-en-attente/{commande}', [CommandeController::class, 'mettreAttenteCommande'])->name('commande.attente');
Route::get('/commande/validee', [CommandeController::class, 'listeCommandeValide'])->name('commande.validee');
Route::get('commandes/send/{commande}', [CommandeController::class, 'sendCommande'])->name('commandes.send');
Route::get('commandes/download/{commande}', [CommandeController::class, 'createAndDownloadPDF'])->name('commandes.download');

<?php

use App\Http\Controllers\ArticleController;
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
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/registerUser', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //ARTICLES
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::post('/ajoutArticle', [ArticleController::class, 'store']);
    Route::get('/editArticle/{id}', [ArticleController::class, 'edit']);
    Route::post('/updateArticle/{id}', [ArticleController::class, 'update']);
    Route::get('/destroyArticle/{id}', [ArticleController::class, 'destroy']);

    //SERVICES
    Route::get('/services', [ServiceController::class, 'create']);
    Route::get('/servicesListes', [ServiceController::class, 'index']);
    Route::post('/ajoutCommande', [ServiceController::class, 'store']);
});

require __DIR__ . '/auth.php';

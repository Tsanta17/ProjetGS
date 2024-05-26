<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProfileController;
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
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {

    //DASHBOARD
    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return Inertia::render('Dashboard');
        } else if ($user->role === 'manager') {

            return Inertia::render('Manager');
        } else if ($user->role === 'user') {

            return Inertia::render('Service');
        }
    })->name('dashboard');

    Route::get('/manager', [ArticleController::class, 'index']);


    //PROFIL
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //ARTICLES
    Route::get('/articles', [ArticleController::class, 'create']);
    Route::post('/ajoutArticle', [ArticleController::class, 'store']);
    Route::get('/editArticle/{id}', [ArticleController::class, 'edit']);
    Route::post('/updateArticle/{id}', [ArticleController::class, 'update']);
    Route::get('/destroyArticle/{id}', [ArticleController::class, 'destroy']);
});




require __DIR__ . '/auth.php';

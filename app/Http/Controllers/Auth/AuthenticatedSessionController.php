<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;


class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        //PRENDRE ROLE DE L'USER
        $userRole = Auth::user()->role;

        //NOMBRES DE FOURNISSEUR
        $fournisseur = DB::table('fournisseurs')
            ->count();

        //NOMBRES D'ARTICLE
        $article = DB::table('articles')
            ->count();

        //COUT
        $cout = DB::table('commandes')
            ->sum('budget_disponible');

        //ARTICLES PERIMES
        $articlePerime = DB::table('articles')
            ->where('date_peremption', '<', now())
            ->count();

        //CHART
        $commandeParMois = DB::table('commandes')
            ->select(DB::raw('COUNT(*) as count'), DB::raw('MONTH(created_at) as month'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->pluck('count', 'month');

        $budgetTotalParMois = DB::table('commandes')
            ->select(DB::raw('SUM(budget_disponible) as total'), DB::raw('MONTH(created_at) as month'))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get()
            ->pluck('total', 'month');
        for ($month = 1; $month <= 12; $month++) {
            if (!isset($commandeParMois[$month])) {
                $commandeParMois[$month] = 0;
            }
            if (!isset($budgetTotalParMois[$month])) {
                $budgetTotalParMois[$month] = 0;
            }
        }

        $commandeParMois = $commandeParMois->sortKeys();
        $budgetTotalParMois = $budgetTotalParMois->sortKeys();

        //Top 3 des commandes
        $topArticles = DB::select("SELECT articles.nom_article, COUNT(*) AS total_commandes FROM (SELECT DISTINCT commandes.reference_article FROM commandes) AS c JOIN articles ON c.reference_article = articles.reference GROUP BY articles.nom_article ORDER BY total_commandes DESC LIMIT 3");
        $totalCommandes = max(array_column($topArticles, 'total_commandes'));

        session([
            'commande_par_mois' => $commandeParMois,
            'budget_total_par_mois' => $budgetTotalParMois,
            'nombreFournisseurs' => $fournisseur,
            'nombreArticles' => $article,
            'coutArticles' => $cout,
            'article_perime' => $articlePerime,
            'top_trois' => $topArticles,
            'max_commande' => $totalCommandes,
            'user_role' => $userRole
        ]);

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Article;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listeCommandes = commande::all();
        return response()->json($listeCommandes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $userSite = $user->site;

        $site = DB::table('sites')->where('nom_site', $userSite)->first();
        $userSiteId = $site->site_id;

        $listeCommandes = DB::table('commandes')
            ->join('articles', 'articles.reference', '=', 'commandes.reference_article')
            ->join('users', 'users.id', '=', 'commandes.user_id')
            ->where('commandes.site_id', $userSiteId)
            ->select('articles.*', 'commandes.*', 'users.departement')
            ->get();

        return view('services.create', compact('listeCommandes', 'user'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $userSite = $user->site;
        $site = DB::table('sites')->where('nom_site', $userSite)->first();;
        $siteId = $site->site_id;

        $statut = 'En attente';

        $commande = new Commande();
        $commande->site_id = $siteId;
        $commande->date_commande = $request->date_commande;
        $commande->reference_article = $request->reference;
        $commande->statut = $statut;
        $commande->user_id = $user->id;
        $commande->budget_disponible = $request->budget_disponible;

        $article = new Article();
        $article->nom_article = $request->nom_article;
        $article->description = $request->description;
        $article->reference = $request->reference;
        $article->site_id = $siteId;

        $commande->save();
        $article->save();

        return redirect()->back()->with('success', 'Commande effectué avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    //liste des stocks par site
    public function listeStockParSite(){
        $user = auth()->user();
        $listeStockParSite = Stock::with('site')
            ->where('site_id', $user->site)
            ->get();
            return view('Stock', [
            'stocks' => $listeStockParSite
        ]);
    }
}

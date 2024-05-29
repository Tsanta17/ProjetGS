<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Article;
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
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        $userId = $user->id;
        $userSite = $user->site;
        $listeCommandes = DB::table('articles')
            ->join('commandes', 'articles.reference', '=', 'commandes.reference_article')
            ->where('commandes.user_id', $userId)
            ->select('articles.*', 'commandes.*')
            ->get();
        return view('services.create', compact('listeCommandes', 'userSite'));
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
        $commande->reference_article = $request->date_commande;
        $commande->statut = $statut;
        $commande->budget_disponible = $request->budget_disponible;

        $article = new Article();
        $article->nom = $request->nom_article;
        $article->description = $request->description;

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
}

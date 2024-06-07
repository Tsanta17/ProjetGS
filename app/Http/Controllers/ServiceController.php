<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Article;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $listeCommandes = commande::all();
    //     return response()->json($listeCommandes);
    // }

    public function getCommandesList()
    {
        $user = auth()->user();
        $listeCommandes = Commande::with('article', 'site')
            ->where('site_id', $user->site)
            ->get()
            ->groupBy('statut');

        return response()->json([
            'enAttente' => $listeCommandes->get('En attente', []),
            'validee' => $listeCommandes->get('validee', []),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = Auth::user();
        // $userSite = $user->site;

        // $site = DB::table('sites')->where('nom_site', $userSite)->first();
        $userSiteId = $user->site;

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
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'nom_article' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'reference' => 'required|string|max:255|unique:articles,reference',
    //         'date_commande' => 'required|date',
    //         'budget_disponible' => 'required|numeric',
    //     ]);

    //     $user = Auth::user();
    //     $siteId = $user->site;

    //     $statut = 'En attente';

    //     // Créer et sauvegarder l'article en premier
    //     $article = new Article();
    //     $article->nom_article = $validatedData['nom_article'];
    //     $article->description = $validatedData['description'];
    //     $article->reference = $validatedData['reference'];
    //     $article->site_id = $siteId;
    //     $article->save();

    //     // Ensuite, créer et sauvegarder la commande
    //     $commande = new Commande();
    //     $commande->site_id = $siteId;
    //     $commande->date_commande = $validatedData['date_commande'];
    //     $commande->reference_article = $article->reference; // Utiliser la référence de l'article créé
    //     $commande->statut = $statut;
    //     $commande->user_id = $user->id;
    //     $commande->budget_disponible = $validatedData['budget_disponible'];
    //     $commande->save();

    //     return redirect()->back()->with('success', 'Commande effectuée avec succès');
    // }

    public function store(Request $request)
{
    $user = Auth::user();
    $siteId = $user->site;

    $statut = 'En attente';

    // Créer et sauvegarder l'article en premier
    $article = new Article();
    $article->nom_article = $request->nom_article;
    $article->description = $request->description;
    $article->reference = $request->reference;
    $article->site_id = $siteId;
    $article->save();

    // Ensuite, créer et sauvegarder la commande
    $commande = new Commande();
    $commande->site_id = $siteId;
    $commande->date_commande = $request->date_commande;
    $commande->reference_article = $article->reference; // Utiliser la référence de l'article créé
    $commande->statut = $statut;
    $commande->user_id = $user->id;
    $commande->budget_disponible = $request->budget_disponible;
    $commande->save();

    return redirect()->back()->with('success', 'Commande effectuée avec succès');
}




    // public function store(Request $request)
    // {
    //     $user = Auth::user();
    //     $userSite = $user->site;
    //     $site = DB::table('sites')->where('nom_site', $userSite)->first();;
    //     $siteId = $site->site_id;

    //     $statut = 'En attente';

    //     $commande = new Commande();
    //     $commande->site_id = $siteId;
    //     $commande->date_commande = $request->date_commande;
    //     $commande->reference_article = $request->reference;
    //     $commande->statut = $statut;
    //     $commande->user_id = $user->id;
    //     $commande->budget_disponible = $request->budget_disponible;

    //     $article = new Article();
    //     $article->nom_article = $request->nom_article;
    //     $article->description = $request->description;
    //     $article->reference = $request->reference;
    //     $article->site_id = $siteId;

    //     $commande->save();
    //     $article->save();

    //     return redirect()->back()->with('success', 'Commande effectué avec succès');
    // }

//     public function store(Request $request)
// {
//     // Vérifier si l'utilisateur est connecté
//     if (Auth::check()) {
//         // L'utilisateur est connecté, récupérer l'utilisateur
//         $user = Auth::user();

//         // Vérifier si l'utilisateur a un site associé
//         if ($user->site) {
//             // L'utilisateur a un site associé, continuer le traitement

//             // Récupérer l'ID du site de l'utilisateur
//             $siteId = $user->site->site_id;

//             // Continuer le traitement avec le site ID récupéré
//             $statut = 'En attente';

//             $commande = new Commande();
//             $commande->site_id = $siteId;
//             $commande->date_commande = $request->date_commande;
//             $commande->reference_article = $request->reference;
//             $commande->statut = $statut;
//             $commande->user_id = $user->id;
//             $commande->budget_disponible = $request->budget_disponible;

//             $article = new Article();
//             $article->nom_article = $request->nom_article;
//             $article->description = $request->description;
//             $article->reference = $request->reference;
//             $article->site_id = $siteId;

//             $commande->save();
//             $article->save();

//             return redirect()->back()->with('success', 'Commande effectué avec succès');
//         } else {
//             // L'utilisateur n'a pas de site associé, gérer cette situation
//             return redirect()->back()->with('error', 'L\'utilisateur n\'a pas de site associé');
//         }
//     } else {
//         // L'utilisateur n'est pas connecté, gérer cette situation
//         return redirect()->back()->with('error', 'Utilisateur non connecté');
//     }
// }

// public function store(Request $request)
// {
//     // Vérifier si l'utilisateur est connecté
//     if (Auth::check()) {
//         // L'utilisateur est connecté, récupérer l'utilisateur
//         $user = Auth::user();

//         // Log pour déboguer
//         Log::info('Utilisateur connecté:', ['user' => $user]);

//         // Vérifier si l'utilisateur a un site associé
//         if ($user->site) {
//             // L'utilisateur a un site associé, continuer le traitement
//             $siteId = $user->site->site_id;

//             // Log pour déboguer
//             Log::info('Site associé trouvé:', ['site_id' => $siteId]);

//             // Continuer le traitement avec le site ID récupéré
//             $statut = 'En attente';

//             $commande = new Commande();
//             $commande->site_id = $siteId;
//             $commande->date_commande = $request->date_commande;
//             $commande->reference_article = $request->reference;
//             $commande->statut = $statut;
//             $commande->user_id = $user->id;
//             $commande->budget_disponible = $request->budget_disponible;

//             $article = new Article();
//             $article->nom_article = $request->nom_article;
//             $article->description = $request->description;
//             $article->reference = $request->reference;
//             $article->site_id = $siteId;

//             $commande->save();
//             $article->save();

//             return redirect()->back()->with('success', 'Commande effectuée avec succès');
//         } else {
//             // L'utilisateur n'a pas de site associé, gérer cette situation
//             Log::error('L\'utilisateur n\'a pas de site associé:', ['user_id' => $user->id]);
//             return redirect()->back()->with('error', 'L\'utilisateur n\'a pas de site associé');
//         }
//     } else {
//         // L'utilisateur n'est pas connecté, gérer cette situation
//         Log::error('Utilisateur non connecté');
//         return redirect()->back()->with('error', 'Utilisateur non connecté');
//     }
// }





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

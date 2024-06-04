<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\Article;
use App\Models\Stock;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    //filtrer les affectations en attente par site
    public function listeAffectation(){
        $user = auth()->user();
        $affectationEnAttente = Affectation::with('site')
            ->where('site_id', $user->site)
            ->where('statut', 'en_attente')
            ->get();
            return view('AffectationEnAttente', [
                'user' => $user,
                'affectationEnAttente' => $affectationEnAttente
            ]);
    }
    //validation d'un affectation par manager
    public function validateAffectation($affectation){
        //mettre à jour le champs statut affectation
        $affectation  = Affectation::findOrFail($affectation);

        //mettre à jour le champ statut de la commande
        $affectation->statut = "validee";
        $affectation->save();

        //récuperer l'id de l'article pour récuperer la quantite du stock
        $stock_id = $affectation->stock_id;
        $stock = Stock::findOrFail($stock_id);
        $quantiteStock = $stock->quantite;

        //récuperer le quantite d'affectation
        $quantiteAffectation = $affectation->quantite;

        //calcul stock affectation et reste stock
        $resteStock = $quantiteStock - $quantiteAffectation;


        //update de la table stock pour inserer le rest du stock
        $stock->quantite = $resteStock;
        $stock->update();

        //ajouter le prix et la quantite à la ligne de commande
        Stock::create([
            'article_id' => $affectation->article_id,
            'site_id' => $affectation->site_id,
            'quantite' => $quantiteAffectation,
            'departement' => $affectation->departement,
        ]);
    }
    //création d'un affectation
    public function store(Request $request){
        //validation des données
        $request->validate([
            'stock_id' => 'required|exists:stocks,stock_id',
            'quantite' => 'required|integer|min:1'
        ]);
    //chercher le stock par id
    $stock = Stock::findOrFail($request->stock_id);

    //check si le request quantite exceeds l'available quantite
        if($request->quantite > $stock->quantite){
            return $erreur = "quantite demandé excède la quantite disponible";
        }

        //création de nouveau affectation
        Affectation::create([
                'quantite' => $request->quantite,
                'article_id' => $stock->article->article_id,
                'site_id' => $stock->site->site_id,
                'user_id' => auth()->id(),
                'departement' => auth()->user()->departement,
                'statut' => 'en_attente',
                'stock_id' => $stock->stock_id
        ]);
    }
}
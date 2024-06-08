<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\Article;
use App\Models\Stock;
use App\Models\User;
use App\Models\Site;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;
use Picqer\Barcode\BarcodeGeneratorHTML;

class AffectationController extends Controller
{
    //filtrer les affectations en attente par site, , 'article','stock', 'user'
    // public function listeAffectation(){
    //     $user = auth()->user();
    //     $affectationEnAttente = Affectation::with('site', 'article', 'user', 'stock')
    //         ->where('site_id', $user->site)
    //         ->where('statut', 'en_attente')
    //         ->get();
    //         return view('AffectationEnAttente', [
    //             'user' => $user,
    //             'affectationEnAttente' => $affectationEnAttente
    //         ]);
    // }
    public function listeAffectation()
    {
        $user = auth()->user();
        
        $affectationsEnAttente = Affectation::with('site', 'article', 'user', 'stock')
            ->where('site_id', $user->site)
            ->where('statut', 'en_attente')
            ->get();
        
        return response()->json([
            'user' => $user,
            'affectationsEnAttente' => $affectationsEnAttente
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

        //Génerer un code-barres unique pour ce stock en utilisant son ID
        $generateur = new BarcodeGeneratorPNG();
        $code_barre = uniqid();
        $code_barre_image = 'data:image/png;base64,'.base64_encode($generateur->getBarcode($code_barre, $generateur::TYPE_CODE_128));

        //créer un stock correspond au affectation
        try {
            Stock::create([
                'article_id' => $affectation->article_id,
                'site_id' => $affectation->site_id,
                'quantite' => $quantiteAffectation,
                'departement' => $affectation->departement,
                'code_barre' => $code_barre_image
            ]);
        } catch (\Exception $e) {
            dd($e->getMessage(), $e->getTraceAsString());
        }
        // return response($code_barre_image)->header('Content-type', 'image/png');
        // redirect()->route('stock.barcode');
    }
    //création d'une affectation
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

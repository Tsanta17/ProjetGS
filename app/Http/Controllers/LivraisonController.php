<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Livraison;
use App\Models\Article;
use App\Models\Commande;
use App\Models\User;
use App\Models\Stock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Picqer\Barcode\BarcodeGeneratorJPG;
use Picqer\Barcode\BarcodeGeneratorPNG;

class LivraisonController extends Controller
{
    //lister livraison en attente et valider
    public function listeLivraison()
    {
        //liste livraison en attente

        $user = Auth()->user();
        $listeLivraisonAttente = DB::select('
        SELECT
        l.livraison_id,l.commande_id,l.site_id,l.quantite,l.numero_lot,l.date_livraison,
        u.id AS userid,u.site
        FROM livraisons l
        JOIN commandes c ON l.commande_id = c.commande_id
        JOIN users u ON c.user_id = u.id
        JOIN sites s ON u.site = s.nom_site AND l.site_id = s.site_id
        WHERE u.id = :userid AND (l.date_livraison IS NULL)
        ORDER BY l.livraison_id;
        ', ['userid' => 2]);

        // ['userid'=> $user->id]

        //liste livraison valider

        $listeLivraisonValider = DB::select('
        SELECT
        l.livraison_id,l.commande_id,l.site_id,l.quantite,l.numero_lot,l.date_livraison,
        u.id AS userid,u.site
        FROM livraisons l 
        JOIN commandes c ON l.commande_id = c.commande_id
        JOIN users u ON c.user_id = u.id
        JOIN sites s ON u.site = s.nom_site AND l.site_id = s.site_id
        WHERE u.id = :userid AND (l.date_livraison IS NOT NULL)
        ORDER BY l.livraison_id;
        ', ['userid' => 2]);

        return view('bonLivraison', compact('listeLivraisonAttente', 'listeLivraisonValider'));
    }


    //Valider livraison en attente    
    public function update(Request $request, $livraison_id)
    {


        //$generator = new BarcodeGeneratorPNG();
        $codeBarre = uniqid();
        //$codeBarreImage = 'stock_id:image/png;base64,'. base64_encode($generator->getBarcode($codeBarre,$generator::TYPE_CODE_128));

        $livraison = Livraison::select('livraison_id', 'date_livraison', 'site_id', 'quantite', 'commande_id')->where('livraison_id', $livraison_id)->first();
        $commande = Commande::select('reference_article', 'user_id')->where('commande_id', $livraison->commande_id)->first();
        $article = Article::select('article_id', 'reference')->where('reference', $commande->reference_article)->first();
        $user = User::select('departement')->where('id', $commande->user_id)->first();

        //insertion des articles valider dans table stocks
        $stock = new Stock();
        $stock->article_id = $article->article_id;
        $stock->site_id = $livraison->site_id;
        $stock->departement = $user->departement;
        $stock->quantite = $livraison->quantite;
        //$stock->code_barre = $codeBarre;
        //$stock->code_barre = $codeBarreImage;
        $stock->save();

        //update date de peremption dans la table articles
        $article->date_peremption = $request->date_peremption;
        $article->save();

        //update date de livraison pour valider la livraison
        $livraison->date_livraison = Carbon::now();
        $livraison->save();

        return redirect('livraison');
    }



    ///liste livraison  pour Administrateur    
    public function listeLivraisonAdministrateur()
    {

        $listeLivraisonAttente = Livraison::all()->where('date_livraison', null);
        $listeLivraisonValider = Livraison::all()->where('date_livraison', !null);
    }
}

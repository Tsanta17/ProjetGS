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
use Illuminate\Support\Facades\Auth;

use Picqer\Barcode\BarcodeGeneratorPNG;
use Picqer\Barcode\BarcodeGeneratorHTML;

class LivraisonController extends Controller
{
    //lister livraison en attente et valider
    // public function listeLivraison()
    // {
    //     //liste livraison en attente = commande validée

    //     $user = Auth::user();
    //     $userid=$user->id;  
    //     echo $userid;
    //     $listeLivraisonAttente = DB::select
    //     ('
    //     SELECT
    //     l.livraison_id,l.quantite,l.nomFournisseur,a.nom_article,s.nom_site
    //     FROM livraisons l
    //     JOIN commandes c ON l.commande_id = c.commande_id
    //     JOIN users u ON c.user_id = u.id
    //     JOIN sites s ON u.site = s.site_id AND l.site_id = s.site_id
    //     JOIN articles a ON a.reference = c.reference_article 
    //     WHERE (u.id = ?) AND (l.date_livraison IS NULL)
    //     ORDER BY l.livraison_id;
    //     ',[$userid]);


    //     //liste livraison valider chaque site

    //     $listeLivraisonValider = DB::select
    //     ('
    //     SELECT
    //     l.livraison_id,l.quantite,l.nomFournisseur,a.nom_article,s.nom_site
    //     FROM livraisons l 
    //     JOIN commandes c ON l.commande_id = c.commande_id
    //     JOIN users u ON c.user_id = u.id
    //     JOIN sites s ON u.site = s.site_id AND l.site_id = s.site_id
    //     JOIN articles a ON a.reference = c.reference_article 
    //     WHERE u.id = :userid AND (l.date_livraison IS NOT NULL)
    //     ORDER BY l.livraison_id;
    //     ',['userid'=> $user->id]);
    //     //return view('bonLivraison', compact('listeLivraisonAttente','listeLivraisonValider'));

    //     return response()->json([
    //         'listeLivraisonAttente' => $listeLivraisonAttente,
    //         'listeLivraisonValider' => $listeLivraisonValider,
    //     ]);
        
    // }

    // Fonction dans le contrôleur
public function listeLivraison()
{
    $user = Auth::user();
    $userid = $user->id;

    $listeLivraisonAttente = DB::table('livraisons')
        ->select('livraison_id', 'quantite', 'nomFournisseur', 'nom_article', 'nom_site')
        ->join('commandes', 'livraisons.commande_id', '=', 'commandes.commande_id')
        ->join('users', 'commandes.user_id', '=', 'users.id')
        ->join('sites', function ($join) {
            $join->on('users.site', '=', 'sites.site_id')
                 ->on('livraisons.site_id', '=', 'sites.site_id');
        })
        ->join('articles', 'articles.reference', '=', 'commandes.reference_article')
        ->where('users.id', $userid)
        ->whereNull('livraisons.date_livraison')
        ->orderBy('livraisons.livraison_id')
        ->get();

    $listeLivraisonValider = DB::table('livraisons')
        ->select('livraison_id', 'quantite', 'nomFournisseur', 'nom_article', 'nom_site')
        ->join('commandes', 'livraisons.commande_id', '=', 'commandes.commande_id')
        ->join('users', 'commandes.user_id', '=', 'users.id')
        ->join('sites', function ($join) {
            $join->on('users.site', '=', 'sites.site_id')
                 ->on('livraisons.site_id', '=', 'sites.site_id');
        })
        ->join('articles', 'articles.reference', '=', 'commandes.reference_article')
        ->where('users.id', $userid)
        ->whereNotNull('livraisons.date_livraison')
        ->orderBy('livraisons.livraison_id')
        ->get();

    return response()->json([
        'listeLivraisonAttente' => $listeLivraisonAttente,
        'listeLivraisonValider' => $listeLivraisonValider,
    ]);
}



    //Valider livraison en attente    
//     public function update(Request $request, $livraison_id)
// {
//     try {
//         $livraison = Livraison::select('livraison_id', 'date_livraison', 'site_id', 'quantite', 'commande_id')
//                               ->where('livraison_id', $livraison_id)
//                               ->firstOrFail();
//         $commande = Commande::select('reference_article', 'user_id')
//                             ->where('commande_id', $livraison->commande_id)
//                             ->firstOrFail();
//         $article = Article::select('article_id', 'reference')
//                           ->where('reference', $commande->reference_article)
//                           ->firstOrFail();
//         $user = User::select('departement')
//                     ->where('id', $commande->user_id)
//                     ->firstOrFail();

//         // Insertion des articles validés dans la table stocks
//         $stock = new Stock();
//         $stock->article_id = $article->article_id;
//         $stock->site_id = $livraison->site_id;
//         $stock->departement = $user->departement;
//         $stock->quantite = $livraison->quantite;
//         $stock->save();

//         // Mise à jour de la date de péremption dans la table articles
//         $article->date_peremption = $request->date_peremption;
//         $article->save();

//         // Mise à jour de la date de livraison pour valider la livraison
//         $livraison->date_livraison = Carbon::now();
//         $livraison->save();

//         return response()->json(['message' => 'Livraison validée avec succès'], 200);
//     } catch (\Exception $e) {
//         Log::error('Erreur de validation de la livraison', ['error' => $e->getMessage()]);
//         return response()->json(['message' => 'Erreur lors de la validation de la livraison'], 500);
//     }
// }


    public function update(Request $request, $livraison_id)
    {


        //$generator = new BarcodeGeneratorPNG();
        $generateur = new BarcodeGeneratorPNG();
        $code_barre = uniqid();
        $code_barre_image = 'data:image/png;base64,'.base64_encode($generateur->getBarcode($code_barre, $generateur::TYPE_CODE_128));

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
        $stock->code_barre = $code_barre_image;
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
    //  public function listeLivraisonAdministrateur() {
    //     $listeLivraisonAttente = DB::select('
    //         SELECT 
    //         l.livraison_id,l.commande_id,l.site_id,l.quantite,l.nomFournisseur,l.date_livraison, 
    //         a.nom_article,s.nom_site
    //         FROM livraisons l 
    //         JOIN commandes c ON l.commande_id = c.commande_id 
            
    //         JOIN users u ON c.user_id = u.id 
    //         JOIN sites s ON u.site = s.site_id AND l.site_id = s.site_id 
            
            
    //         JOIN articles a ON a.reference = c.reference_article
    //         WHERE l.date_livraison IS NULL ; 
    //     ');

    //     $listeLivraisonValider = DB::select('
    //         SELECT 
    //         l.livraison_id,l.commande_id,l.site_id,l.quantite,l.nomFournisseur,l.date_livraison, 
    //         a.nom_article,s.nom_site
    //         FROM livraisons l 
    //         JOIN commandes c ON l.commande_id = c.commande_id 
            
    //         JOIN users u ON c.user_id = u.id 
    //         JOIN sites s ON u.site = s.site_id AND l.site_id = s.site_id 
            
            
    //         JOIN articles a ON a.reference = c.reference_article
    //         WHERE l.date_livraison IS NOT NULL ; 
    //     ');

    //     return response()->json([
    //         'listeLivraisonAttente' => $listeLivraisonAttente,
    //         'listeLivraisonValider' => $listeLivraisonValider,
    //     ]);
    // }
    public function listeLivraisonAdministrateur()
    {
        $listeLivraisonAttente = DB::table('livraisons')
            ->select(
                'livraisons.livraison_id',
                'livraisons.commande_id',
                'livraisons.site_id',
                'livraisons.quantite',
                'livraisons.nomFournisseur',
                'livraisons.date_livraison',
                'articles.nom_article',
                'sites.nom_site'
            )
            ->join('commandes', 'livraisons.commande_id', '=', 'commandes.commande_id')
            ->join('users', 'commandes.user_id', '=', 'users.id')
            ->join('sites', function ($join) {
                $join->on('users.site', '=', 'sites.site_id')
                    ->on('livraisons.site_id', '=', 'sites.site_id');
            })
            ->join('articles', 'articles.reference', '=', 'commandes.reference_article')
            ->whereNull('livraisons.date_livraison')
            ->get();

        $listeLivraisonValider = DB::table('livraisons')
            ->select(
                'livraisons.livraison_id',
                'livraisons.commande_id',
                'livraisons.site_id',
                'livraisons.quantite',
                'livraisons.nomFournisseur',
                'livraisons.date_livraison',
                'articles.nom_article',
                'sites.nom_site'
            )
            ->join('commandes', 'livraisons.commande_id', '=', 'commandes.commande_id')
            ->join('users', 'commandes.user_id', '=', 'users.id')
            ->join('sites', function ($join) {
                $join->on('users.site', '=', 'sites.site_id')
                    ->on('livraisons.site_id', '=', 'sites.site_id');
            })
            ->join('articles', 'articles.reference', '=', 'commandes.reference_article')
            ->whereNotNull('livraisons.date_livraison')
            ->get();
            
        return response()->json([
            'listeLivraisonAttente' => $listeLivraisonAttente,
            'listeLivraisonValider' => $listeLivraisonValider,
        ]);
    }

    
}



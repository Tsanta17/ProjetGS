<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class HistoriqueArticleController extends Controller
{
   
    public function getDetails($article_id)
    {
        
        $articleDetail = DB::table('articles as a')
        ->leftJoin('fournisseurs as f', 'a.fournisseur_id', '=', 'f.fournisseur_id')
        ->leftJoin('commandes as c', 'a.reference', '=', 'c.reference_article')
        ->leftJoin('livraisons as l', 'c.commande_id', '=', 'l.commande_id')
        ->leftJoin('sites as s', 'l.site_id', '=', 's.site_id')
        ->leftJoin('stocks as st', 'a.article_id', '=', 'st.article_id')
        ->select 
        (
            'a.article_id', 'a.nom_article', 'a.date_peremption',
            'f.nom_fournisseur',
            'c.date_commande',
            'l.date_livraison', 'l.quantite as quantite_commande',
            's.nom_site',
            'st.departement as departement_stock_initial',
            'st.quantite as quantite_stock',
        )
        ->where('a.article_id', $article_id) 
        ->get();
        
        $articleHistorique = DB::table('articles as a')
            ->leftJoin('fournisseurs as f', 'a.fournisseur_id', '=', 'f.fournisseur_id')
            ->leftJoin('commandes as c', 'a.reference', '=', 'c.reference_article')
            ->leftJoin('livraisons as l', 'c.commande_id', '=', 'l.commande_id')
            ->leftJoin('sites as s', 'l.site_id', '=', 's.site_id')
            ->leftJoin('stocks as st', 'a.article_id', '=', 'st.article_id')
            ->leftJoin('affectations as af', 'a.article_id', '=', 'af.article_id')
            ->select 
            (
               
                'af.departement as departement_affectation',
                'af.quantite as quantite_affecte',
                'af.date_affectation'
            )
            ->where('a.article_id', $article_id) 
            ->where('af.statut', 'validee')
            ->orderBy('c.date_commande')
            ->orderBy('l.date_livraison')
            ->get();
            return view('historiqueDetail', compact('articleHistorique','articleDetail'));
        
            //return response()->json($articleDetails);
    }
}

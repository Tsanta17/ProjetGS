<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\SortieStock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class StockController extends Controller
{

    //affichage détail article
    public function show(Stock $stock)
    {
        // dd($fournisseur);
        return view('StockDetail', [
            'stock' => $stock
        ]);
    }

    //lister tous les stock en cours sur chaque site
    public function listeStock(){

        $user = Auth::user();
        $siteid=$user->site;

        $listeStock = DB::select
        ('
        SELECT DISTINCT
        st.quantite,a.nom_article,a.date_peremption,s.nom_site 
        FROM stocks st 
        JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
        JOIN sites s ON st.site_id = s.site_id 
        JOIN users u ON s.site_id = u.site 
        WHERE a.date_peremption >= CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY)
        AND (u.site = ?) '
        ,[$siteid]);
 
        $listeStockPerime = DB::select
        ('
        SELECT DISTINCT
        st.quantite,a.nom_article,a.date_peremption,s.nom_site 
        FROM stocks st 
        JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
        JOIN sites s ON st.site_id = s.site_id 
        JOIN users u ON s.site_id = u.site 
        WHERE a.date_peremption <= CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY)
        AND (u.site = ?) '
        ,[$siteid]);
        
        return response()->json([
            'listeStock' => $listeStock,
            'listeStockPerime' => $listeStockPerime
        ]);
    }

    //Lister stock en peremption sur chaque site
    public function listeStockPerime(){
    
        $user = Auth::user();
        $siteid=$user->site;

        //liste des stocks atteint la date de peremption
        $listeStockPerime = DB::select
        ('
        SELECT DISTINCT
        st.quantite,a.nom_article,a.date_peremption,s.nom_site 
        FROM stocks st 
        JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
        JOIN sites s ON st.site_id = s.site_id 
        JOIN users u ON s.site_id = u.site 
        WHERE a.date_peremption <= CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY)
        AND (u.site = ?) '
        ,[$siteid]);

        
        //liste stock en cour de peremption
        $listeStockEncourPerime = DB::select
        ('
        SELECT DISTINCT
        st.quantite,a.nom_article,a.date_peremption,s.nom_site 
        FROM stocks st 
        JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
        JOIN sites s ON st.site_id = s.site_id 
        JOIN users u ON s.site_id = u.site 
        WHERE a.date_peremption BETWEEN CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY)
        AND (u.site = ?) '
        ,[$siteid]);
        
        //return view('listeStockperime', compact('listeStockEncourPerime','listeStockPerime'));
        
    }

    //Supprimer stock en peremption
    public function supprimerListeStockPerime($stock_id){
    
        $stockPerime = Stock::find($stock_id);
        $stockPerime->delete();
        return redirect()->back();
        
        
    }

    //lister stock dans Administrateur

    public function listeStockAdmin() {
        // lister stock  
        $listeStock = DB::select('
            SELECT DISTINCT
            st.stock_id, st.quantite, a.nom_article, a.date_peremption, s.nom_site 
            FROM stocks st 
            JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
            JOIN sites s ON st.site_id = s.site_id 
            JOIN users u ON s.site_id = u.site 
            WHERE a.date_peremption >= CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ');
    
        // lister stock perime
        $today = Carbon::now()->toDateString(); 
        $listeStockPerime = DB::select('
            SELECT DISTINCT
            st.stock_id, st.quantite, a.nom_article, a.date_peremption, s.nom_site 
            FROM stocks st 
            JOIN articles a ON st.article_id = a.article_id AND st.site_id = a.site_id 
            JOIN sites s ON st.site_id = s.site_id 
            JOIN users u ON s.site_id = u.site 
            AND (a.date_peremption <= ?)
        ', [$today]);
    
        return response()->json([
            'listeStock' => $listeStock,
            'listeStockPerime' => $listeStockPerime
        ]);
    }

}

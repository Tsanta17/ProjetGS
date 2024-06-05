<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\SortieStock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


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


    //lister tous les stock en cours 
    public function listeStock()
    {

        /*$today =Carbon::now()->toDateString();

        $listeStock = DB::table('stocks')
        ->join('articles','stocks.article_id','=','articles.article_id')
        ->where('articles.date_peremption','>',$today)
        ->select
            (
            'stocks.article_id as article_id','stocks.stock_id as stock_id',
            'stocks.site_id as site_id','stocks.quantite as quantite',
            'articles.nom_article as nom_article', 'articles.date_peremption'
            )
        ->get();*/
        $listeStock = DB::select('
        SELECT
        s.stock_id,s.article_id,s.site_id,s.quantite,a.nom_article,a.date_peremption
        FROM stocks s 
        JOIN articles a ON s.article_id = a.article_id
        WHERE a.date_peremption  >= CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY);
        ');

        return view('listeStock', compact('listeStock'));
    }

    //Lister stock en peremption
    public function listeStockPerime()
    {

        //liste des stocks atteint la date de peremption
        $today = Carbon::now()->toDateString();

        $listeStockperimes = Stock::whereHas('article', function ($query) use ($today) {
            $query->where('date_peremption', '<=', $today);
        })->with('article')->get();

        //liste stock en cour de peremption

        $listeStockperime = DB::select('
        SELECT
        s.stock_id,s.article_id,s.site_id,s.quantite,s.code_barre,a.nom_article,a.date_peremption
        FROM stocks s 
        JOIN articles a ON s.article_id = a.article_id
        WHERE a.date_peremption  BETWEEN CURDATE() AND DATE_ADD( CURDATE(),INTERVAL 30 DAY);
        ');

        return view('listeStockperime', compact('listeStockperime', 'listeStockperimes'));
    }

    //Supprimer stock en peremption
    public function supprimerListeStockPerime($stock_id)
    {

        $stockPerime = Stock::find($stock_id);
        $stockPerime->delete();
        return redirect()->back();
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    //affichage détail article
    public function show(Stock $stock){
        // dd($fournisseur);
        return view('StockDetail',[
            'stock' => $stock
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HistoryController extends Controller
{
    public function index()
    {
        // Récupérer les entrées de l'historique pour l'utilisateur connecté
        $historiques = Historique::with(['user', 'article'])->where('user_id', Auth::id())->get();

        return response()->json($historiques);
    }

}

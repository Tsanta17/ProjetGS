<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Http\Controllers\Confirm;

use Illuminate\Http\Request;

use function Laravel\Prompts\confirm;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $listeArticles = article::all();
        return view('articles.create', compact('listeArticles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $article = new Article();

        $article->reference = $request->reference;
        $article->nom = $request->nom;
        $article->description = $request->description;
        $article->date_peremption = $request->date_peremption;
        $article->stock_central = $request->stock_central === 'on' ? 1 : 0;
        $article->fournisseur_id = $request->fournisseur_id;
        $article->actif = $request->actif === 'on' ? 1 : 0;
        $article->alerte_peremption = $request->alerte_peremption === 'on' ? 1 : 0;
        $article->site_id = $request->site_id;

        // dd($article);

        $article->save();

        return redirect()->back()->with('success', 'Article ajouté avec succès');
    }

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
        $data = article::findOrFail($id);
        return view('articles.update', compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = article::findOrFail($id);
        $data->reference = $request->reference;
        $data->nom = $request->nom;
        $data->description = $request->description;
        $data->date_peremption = $request->date_peremption;
        $data->stock_central = $request->stock_central === 'on' ? 1 : 0;
        $data->fournisseur_id = $request->fournisseur_id;
        $data->actif = $request->actif === 'on' ? 1 : 0;
        $data->alerte_peremption = $request->alerte_peremption === 'on' ? 1 : 0;
        $data->site_id = $request->site_id;

        $data->save();

        return redirect()->back()->with('success', 'Article modifié avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = article::findOrFail($id);
        $data->delete();
        return redirect()->back()->with('success', 'Article supprimé avec succès');
    }
}

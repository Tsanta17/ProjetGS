<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Http\Controllers\Confirm;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use function Laravel\Prompts\confirm;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     $listeArticles = article::all();
    //     return view('articles.create', compact('listeArticles'));
    // }

    public function index(): Response
    {
        return Inertia::render('./layout/AppForm');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $article = new Article();

        $article->reference = $request->reference;
        $article->nom_article = $request->name;
        $article->description = $request->description;
        $article->date_peremption = $request->date_peremption;
        $article->fournisseur_id = $request->fournisseur_id;
        $article->site_id = $request->siteId;

        // dd($article);

        $article->save();

        return redirect()->back()->with('success', 'Article ajouté avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $listeArticles = article::all();
        return response()->json($listeArticles);
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
        $data->nom_article = $request->nom;
        $data->description = $request->description;
        $data->date_peremption = $request->date_peremption;
        $data->fournisseur_id = $request->fournisseur_id;
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

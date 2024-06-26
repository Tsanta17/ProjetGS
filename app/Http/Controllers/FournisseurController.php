<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    //création d'un fournisseur
    public function store(Request $request){
        $request->validate([
            'nom_fournisseur' => 'required|string',
            'adresse_fournisseur' => 'required|string',
            'phone_fournisseur' => 'required|string',
            'email_fournisseur' => 'required|string',
        ]);
        Fournisseur::create($request->all());
        return redirect()->route('fournisseurList')->with('success', 'fournisseur ajouté');
    }
    //Liste des fournisseurs

    public function list()
    {
        $fournisseurs = Fournisseur::all();
        return response()->json($fournisseurs);
    }


    //suppression d'un fournisseur
    public function destroy($id){
        $fournisseur = Fournisseur::find($id);
        $fournisseur->delete();
        return redirect()->route('fournisseurList')->with('success', 'fournisseur supprimé');
    }
    //modification d'un fournisseur
   
    public function update(Request $request, $id)
    {
        $request->validate([
            'nom_fournisseur' => 'required|string',
            'adresse_fournisseur' => 'required|string',
            'phone_fournisseur' => 'required|string',
            'email_fournisseur' => 'required|string|unique:fournisseurs,email_fournisseur,' . $id . ',fournisseur_id',
        ]);

        $fournisseur = Fournisseur::findOrFail($id);
        $fournisseur->update($request->all());

        return response()->json(['message' => 'Supplier updated successfully', 'fournisseur' => $fournisseur]);
    }

    //importer les données fournisseurs à éditer
    public function edit(Fournisseur $fournisseur){
        // dd($fournisseur);
        return view('modifierFournisseur', compact('fournisseur'));
    }
    //Affichage détail d'un fournisseur
    public function show(Fournisseur $fournisseur){
        // dd($fournisseur);
        return view('detailFournisseur',[
            'fournisseurDetail' => $fournisseur
        ]);
    }
    //Liste des commandes associées au fournisseur
    public function index($idFournisseur){
        //trouve le fournisseur par ID
        $fournisseur = Fournisseur::findOrFail(1);
        $commandes = $fournisseur->commandes;//récupère les commandes associées à ce fournisseur
        // dd($commandes);
        return view('fournisseur', ['commande' => $commandes]);
    }

    public function delete($fournisseur)
    {
        $fournisseur = Fournisseur::findOrFail($fournisseur);
        $fournisseur->delete();

        return response()->json(['message' => 'Supplier deleted successfully']);
    }


    //Liste des fournisseurs
    public function listeFournisseur(){
        //récupération des fournisseurs
        $fournisseurs = Fournisseur::all();
        // dd($fournisseurs);
        return view('listeFournisseur', ['fournisseur' => $fournisseurs]);
    }

}

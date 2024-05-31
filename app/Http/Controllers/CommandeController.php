<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\CommandeLigne;
use App\Models\Livraison;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CommandeController extends Controller
{
    //liste des commandes pour le manager d'un site
    public function commandeParSite(){

        $user = auth()->user();
        $tousLesCommandes = Commande::with('ligneDeCommande')
            ->where('site_id', $user->site_id)
            ->get();
            return view('CommandeParSite', [
                'user' => $user,
                'tousLesCommande' => $tousLesCommandes
            ]);
    }
    // Filtrer les demandes en attente par site
    public function commandeEnAttente(){
        $user = auth()->user();
        $commandeEnAttente = Commande::with('ligneDeCommande')
            ->where('site_id', $user->site_id)
            ->where('statut', 'en_attente')
            ->get();
            return view('commandeAttente', [
                'user' => $user,
                'commandeEnAttente' => $commandeEnAttente
            ]);
    }
    //Affichage détail commande
    public function detailCommande($commande_id){
        $commande = Commande::with(['article','fournisseur'])
            ->findOrFail($commande_id);

        return view('DetailsCommande', [
            'commande' => $commande
        ]);
    }
    //validation d'une commande
    public function validateCommande($commande, Request $request){
        //validation des champs supplémentaires
        $request->validate([
            'date' => 'required|date',
            'prix_unitaire' => 'required|numeric',
            'quantite' => 'required|numeric'
        ]);
        //récuperer la commande
        $commande  = Commande::findOrFail($commande);

        //mettre à jour le champ statut de la commande
        $commande->statut = "validee";
        $commande->save();

        //Mettre à jour la date de l'article
        $article = $commande->article;
        $article->date_peremption = $request->input('date');
        $article->save();

        //ajouter le prix et la quantite à la ligne de commande
        CommandeLigne::create([
            'commande_id' => $commande->commande_id,
            'article_id' => $commande->article_id,
            'quantite' => $request->quantite,
            'prix_unitaire' => $request->prix_unitaire,
            'statut' => "ok"
        ]);

        //ajout  de la table livraison
        Livraison::create([
            'commande_id' => $commande->commande_id,
            'numero_lot' => $commande->fournisseur->nom_fournisseur,
            'quantite' => $request->quantite,
            'site_id' => $commande->site_id,
        ]);

        return view('commandeEnAttente', [
            'commande' => $commande
        ]);
    }
    //mettre en attente une commande
    public function mettreAttenteCommande($commande){
        //recuperer la commande
        $commande = Commande::findOrFail($commande);

        //mettre à jour le statut de la commande
        $commande->statut = "en_attente";
        $commande->save();
        return view('commandeEnAttente', [
            'commande' => $commande
        ]);
    }
    //liste des commandes validées
    public function listeCommandeValide(){
        $user = auth()->user();
        $commandeEnAttente = Commande::with('ligneDeCommande')
            ->where('site_id', $user->site_id)
            ->where('statut', 'validee')
            ->get();
            return view('commandeValidee', [
                'user' => $user,
                'commandeEnAttente' => $commandeEnAttente
            ]);
    }
    //Générer des PDF des commandes et les envoyer par email aux adresses des fournisseurs
    public function sendCommande($commande){
        {
            $commande = Commande::with('fournisseur')->findOrFail($commande);

            // Générer le PDF

            $pdf = PDF::loadView('pdf', [
                'commande' => $commande
            ]);

            // Enregistrer le PDF localement
            $pdfPath = storage_path('app/public/commandes/commande_'.$commande->nom_commande.'.pdf');
            $pdf->save($pdfPath);

            // Envoyer l'email
            Mail::send('emails', compact('commande'), function($message) use ($commande, $pdfPath) {
                $message->to($commande->fournisseur->email_fournisseur);
                $message->subject('Votre commande');
                $message->attach($pdfPath);
            });

            return back()->with('success', 'Commande envoyée avec succès.');
        }

    }
    // Méthode pour créer et télécharger le PDF
    public function createAndDownloadPDF($commande)
    {
        // Récupérer la commande avec le fournisseur associé
        $commande = Commande::with('fournisseur')->findOrFail($commande);

        // Générer le PDF en utilisant la façade
        $pdf = PDF::loadView('pdf', compact('commande'));

        // Retourner le PDF comme réponse pour téléchargement
        return $pdf->download('commande_' . $commande->commande_id . '.pdf');
    }

    //Gestion des Abonnements pour Livraisons Périodiques
    public function abonnemementCommande(){

    }
    //Gestion des Signatures Électroniques
    public function signatureElectronique(){

    }

}

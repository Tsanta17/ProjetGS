<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;
    protected $primaryKey = 'commande_id';

    protected $fillable = [
        'commande_id',
        'article_id',
        'fournisseur_id',
        'site_id',
        'date_commande',
        'statut',
        'abonnement',
        'budget_disponible',
        'nom_commande'
    ];
    public function fournisseur(){
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id', 'fournisseur_id');
    }
    public function ligneDeCommande(){
        return $this->hasMany(CommandeLigne::class, 'commande_id', 'commande_id');
    }
    public function article(){
        return $this->belongsTo(Article::class, 'reference_article', 'reference');
    }
    //relation avec commande
    public function site(){
        return $this->belongsTo(Site::class, 'site_id', 'site_id');
    }
}

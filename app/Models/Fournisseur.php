<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;
    protected $primaryKey = 'fournisseur_id';

    protected $fillable = [
        'nom_fournisseur', 'adresse_fournisseur', 'phone_fournisseur', 'email_fournisseur'
    ];

    //définir la relation avec le modèle Commande
    public function commandes(){
        return $this->hasMany(Commande::class, 'fournisseur_id', 'fournisseur_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandeLigne extends Model
{
    use HasFactory;
    protected $primaryKey = 'lignes_id';

    protected $fillable = [
        'lignes_id',
        'commande_id',
        'article_id',
        'quantite',
        'prix_unitaire',
        'statut'
    ];

    public function commande(){
        return $this->belongsTo(Commande::class, 'commande_id', 'commande_id');
    }

}

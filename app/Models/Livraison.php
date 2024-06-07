<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    use HasFactory;
    protected $primaryKey = 'livraison_id';

    protected $fillable = [
        'commande_id',
        'date_livraison',
        'nomFournisseur',
        'quantite',
        'site_id'
    ];

}

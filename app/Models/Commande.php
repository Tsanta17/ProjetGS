<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;
    protected $primaryKey = 'commande_id';
    public function fournisseur(){
        return $this->belongsTo(Commande::class, 'fournisseur_id', 'fournisseur_id');
    }
}

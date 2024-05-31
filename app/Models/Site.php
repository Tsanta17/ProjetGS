<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;
    protected $primaryKey = 'site_id';

    protected $fillable = [
        'nom_site',
        'adresse_site'
    ];
    //relation avec commande
    public function commande(){
        return $this->hasMany(Commande::class, 'site_id', 'site_id');
    }
}

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
    //relation avec affectation
    public function affectation(){
        return $this->hasMany(Affectation::class, 'site_id', 'site_id');
    }
    public function stocks(){
        return $this->hasMany(Stock::class, 'site_id', 'site_id');
    }
    
}

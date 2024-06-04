<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    use HasFactory;
    protected $primaryKey = 'affectation_id';
    protected $fillable = [
        'stock_id',
        'quantite',
        'statut',
        'affectation_id',
        'date_affectation',
        'article_id',
        'site_id',
        'user_id',
        'departement'
    ];
    public function article(){
        return $this->belongsTo(Article::class, 'article_id', 'article_id');
    }
    //relation avec commande
    public function site(){
        return $this->belongsTo(Site::class, 'site_id', 'site_id');
    }
    public function stock(){
        $this->belongsTo(Stock::class, 'stock_id', 'stock_id');
    }

}

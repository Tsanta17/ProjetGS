<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $primaryKey = 'stock_id';

    protected $fillable = [
        'article_id',
        'site_id',
        'departement',
        'quantite',
        'code_barre'

    ];
    public function site(){
        return $this->belongsTo(Site::class, 'site_id', 'site_id');
    }
    public function article(){
        return $this->belongsTo(Article::class, 'article_id', 'article_id');
    }

    public function affectations(){
        return $this->hasMany(Affectation::class, 'stock_id', 'stock_id');
    }

}

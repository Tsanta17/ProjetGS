<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $primaryKey = 'article_id';
    public function commande(){
        return $this->hasMany(Commande::class, 'reference', 'reference_article');
    }
    public function affectation(){
        return $this->hasMany(Affectation::class, 'article_id', 'article_id');
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class, 'article_id', 'article_id');
    }
}

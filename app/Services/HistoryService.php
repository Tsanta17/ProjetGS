<?php

namespace App\Services;

use App\Models\Historique;
use Illuminate\Support\Facades\Auth;

class HistoryService
{
    /**
     * Enregistrer une action dans l'historique.
     *
     * @param string $action
     * @param string $description
     * @param int $article_id
     * @return void
     */
    public function logAction($action, $description, $article_id)
    {
        Historique::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $description,
            'article_id' => $article_id,
        ]);
    }
}

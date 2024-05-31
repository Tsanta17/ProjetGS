<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter un Article</title>
</head>

<body>
    <h1>Ajouter un Article</h1>
    <p>
        @if(session()->has('success'))
    <div class="alert alert-success bg-success text-light border-0 alert-dismissible fade show" role="alert">
        {{session()->get('success')}}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close">X</button>
    </div>
    @endif
    </p>

    <form action="{{ url('ajoutArticle') }}" method="POST">
        @csrf
        <div>
            <label for="reference">Référence</label>
            <input type="text" name="reference" id="reference" required>
        </div>
        <div>
            <label for="nom">Nom</label>
            <input type="text" name="nom" id="nom" required>
        </div>
        <div>
            <label for="description">Description</label>
            <textarea name="description" id="description"></textarea>
        </div>
        <div>
            <label for="date_peremption">Date de Péremption</label>
            <input type="date" name="date_peremption" id="date_peremption">
        </div>
        <div>
            <label for="stock_central">Stock Central</label>
            <input type="checkbox" name="stock_central" id="stock_central">
        </div>
        <div>
            <label for="fournisseur_id">Fournisseur ID</label>
            <input type="number" name="fournisseur_id" id="fournisseur_id" required>
        </div>
        <div>
            <label for="actif">Actif</label>
            <input type="checkbox" name="actif" id="actif" checked>
        </div>
        <div>
            <label for="alerte_peremption">Alerte Péremption</label>
            <input type="checkbox" name="alerte_peremption" id="alerte_peremption">
        </div>
        <div>
            <label for="site_id">Site ID</label>
            <input type="number" name="site_id" id="site_id" required>
        </div>
        <button type="submit">Ajouter</button>
    </form>
    <hr>
    <span><b>Liste des articles</b></span>
    <br>
    <table border="1">
        <tr>
            <th>Référence</th>
            <th>Nom</th>
            <th>Déscription</th>
            <th>Date péremption</th>
            <th>Fournisseur</th>
            <th>Actif</th>
            <th>Site</th>
            <th>Actions</th>
        </tr>

        @foreach($listeArticles as $article)
        <tr>
            <td>{{$article->reference}}</td>
            <td>{{$article->nom}}</td>
            <td>{{$article->description}}</td>
            <td>{{$article->date_peremption}}</td>
            <td>{{$article->fournisseur_id}}</td>
            <td>{{$article->actif}}</td>
            <td>{{$article->site_id}}</td>
            <td>
                <a href="{{ url('/editArticle',$article->article_id) }}">Modifier</a>|
                <a onclick="return confirm('Vous êtes sûr de vouloir supprimer?')" href="{{ url('/destroyArticle',$article->article_id) }}">Supprimer</a>
            </td>
        </tr>
        @endforeach

    </table>
    <hr>

</body>

</html>
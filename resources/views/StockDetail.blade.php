<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Affichage d'un stock et demande d'affectation</h1>
        <p>Stock id : {{ $stock->stock_id}}</p>
        <p>Nom article :{{ $stock->article->nom_article}}</p>
        <p>Nom Site Article :{{ $stock->site->nom_site}}</p>
        <p>Departement : {{ $stock->departement}}</p>
        <p>Quantité : {{ $stock->quantite}}</p>

        <form action="{{ route('affectation.store') }}" method="post">
            @csrf
            <input type="hidden" name="stock_id" value="{{ $stock->site_id }}">
            <input type="number" name="quantite" id="">
            <button type="submit">Demander Affectation</button>
        </form>
</body>
</html>

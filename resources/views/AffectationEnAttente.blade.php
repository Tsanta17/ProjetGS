<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Liste des affectations en attente </h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>affectation id</th>
                <th>quantite</th>
                <th>article id</th>
                <th>site id</th>
                <th>user id</th>
                <th>departement</th>
                <th>statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($affectationEnAttente as $affectation)
                <tr>
                    <td>{{$affectation->affectation_id}}</td>
                    <td>{{$affectation->quantite}}</td>
                    <td>{{$affectation->article->nom_article}}</td>
                    <td>{{$affectation->site->nom_site}}</td>
                    <td>{{$affectation->user_id}}</td>
                    <td>{{$affectation->departement}}</td>
                    <td>{{$affectation->statut}}</td>
                    <td><a href="{{ route('affectation.valider', $affectation->affectation_id)}}">Valider</a></td>
                    {{-- <td><a href="{{ route('commandes.send', $commande->commande_id)}}">Envoyer vers fournisseur</a><a href="{{ route('commandes.download', $commande->commande_id)}}">dowloadpdf</a></td> --}}
                    {{-- <td><a href="">Verifier</a></td> --}}
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document </title>
</head>
<body>
<h1>Liste des commandes validée</h1>
<p>vous êtes le manager de {{ $user->site }}</p>
<h1>Liste des commandes validee </h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>commande id</th>
                <th>Fournisseur</th>
                <th>site</th>
                <th>date de Commande</th>
                <th>statut</th>
                <th>abonnement</th>
                <th>Budget Disponible</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($commandeEnAttente as $commande)
                <tr>
                    <td>{{$commande->commande_id}}</td>
                    <td>{{$commande->fournisseur_id}}</td>
                    <td>{{$commande->site_id}}</td>
                    <td>{{$commande->date_commande}}</td>
                    <td>{{$commande->statut}}</td>
                    <td>{{$commande->abonnement}}</td>
                    <td>{{$commande->budget_disponible}}</td>
                    <td><a href="">modifier</a><a href="{{ route("commande.detail", $commande->commande_id) }}">Détails</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

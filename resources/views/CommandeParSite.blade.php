<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Liste de tous les commandes pour le site {{ $user->site_id}}</h1>
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
            @foreach ($tousLesCommande as $allCommande )
                <tr>
                    <td>{{$allCommande->commande_id}}</td>
                    <td>{{$allCommande->fournisseur_id}}</td>
                    <td>{{$allCommande->site_id}}</td>
                    <td>{{$allCommande->date_commande}}</td>
                    <td>{{$allCommande->statut}}</td>
                    <td>{{$allCommande->abonnement}}</td>
                    <td>{{$allCommande->budget_disponible}}</td>
                    <td><a href="">modifier</a><a href="{{ route('commande.detail', $allCommande->commande_id) }}">afficher</a></td>
                    <td><a href="http://">supprimer</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

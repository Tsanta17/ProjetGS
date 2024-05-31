<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Fournisseur</h1>
    <h2>Liste des commandes associé au fournisseur</h2>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th>Fournisseur ID</th>
                <th>Site ID</th>
                <th>Date commande</th>
                <th>statut</th>
                <th>abonnement</th>
                <th>budget disponnible</th>
                <th>telecharger le pdf</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($commande as $commande)
                <tr>
                    <td>{{$commande->commande_id}}</td>
                    <td>{{$commande->fournisseur_id}}</td>
                    <td>{{$commande->site_id}}</td>
                    <td>{{$commande->date_commande}}</td>
                    <td>{{$commande->statut}}</td>
                    <td>{{$commande->abonnement}}</td>
                    <td>{{$commande->budget_disponible}}</td>
                    <td><a href="http://">téléchargement pdf</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <p>vous êtes le manager de {{ $user->site }}</p>
<h1>Liste des commandes Abonnées </h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>commande id</th>
                <th>Fournisseur</th>
                <th>site</th>
                <th>date de Commande</th>
                <th>statut</th>
                <th>Reference article</th>
                <th>abonnement</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($commandeAbonnee as $abonnee)
                <tr>
                    <td>{{$abonnee->commande_id}}</td>
                    <td>{{$abonnee->fournisseur->nom_fournisseur}}</td>
                    <td>{{$abonnee->site->nom_site}}</td>
                    <td>{{$abonnee->date_commande}}</td>
                    <td>{{$abonnee->statut}}</td>
                    <td>{{$abonnee->abonnement}}</td>
                    <td>{{$abonnee->budget_disponible}}</td>
                    <td><a href="{{ route('commandes.send', $abonnee->commande_id)}}">Envoyer vers fournisseur</a><a href="{{ route('commandes.download', $abonnee->commande_id)}}">dowloadpdf</a></td>
                    <td><a href="http://">supprimer</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

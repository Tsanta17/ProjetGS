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
    <h1>Ajout d'un fournisseur</h1>
    <form action="{{ route('fournisseur.store') }}" method="POST">
        @csrf
        <input type="text" name="nom_fournisseur" id="" placeholder="nom du fournisseur">
        <input type="text" name="adresse_fournisseur" id="" placeholder="adresse du fournisseur">
        <input type="text" name="phone_fournisseur" id="" placeholder="phone du fournisseur">
        <input type="email" name="email_fournisseur" id="" placeholder="email du fournisseur">
        <input type="submit">
    </form>

    <h1>Liste Fournisseurs</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th>Fournisseur ID</th>
                <th>Fournisseur ID</th>
                <th>NOM</th>
                <th>Adresse</th>
                <th>Phone</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($fournisseur as $fournisseur)
                <tr>
                    <td>{{$fournisseur->fournisseur_id}}</td>
                    <td>{{$fournisseur->nom_fournisseur}}</td>
                    <td>{{$fournisseur->adresse_fournisseur}}</td>
                    <td>{{$fournisseur->phone_fournisseur}}</td>
                    <td>{{$fournisseur->email_fournisseur}}</td>
                    <td><a href="{{ route('fournisseur.edit', $fournisseur->fournisseur_id) }}">modifier</a><a href="{{ route('fournisseur.show', $fournisseur->fournisseur_id) }}">afficher</a></td>
                    <td><a href="http://">supprimer</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>

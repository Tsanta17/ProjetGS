<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <h1>Affichage d'un fournisseur</h1>
        <p>NOM DU FOURNISSEUR : {{ $fournisseurDetail->nom_fournisseur}}</p>
        <p>Adress DU FOURNISSEUR :{{ $fournisseurDetail->adresse_fournisseur}}</p>
        <p>phone DU FOURNISSEUR :{{ $fournisseurDetail->phone_fournisseur}}</p>
        <p>email DU FOURNISSEUR : {{ $fournisseurDetail->email_fournisseur}}</p>
</body>
</html>

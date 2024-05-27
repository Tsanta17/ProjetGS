<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <h1>Ajout d'un fournisseur</h1>

    <form action="{{ route('fournisseur.update', $fournisseur->fournisseur_id) }}" method="POST">
        @csrf
        <input type="text" name="nom_fournisseur" value="{{ $fournisseur->nom_fournisseur }}" id="">
        <input type="text" name="adresse_fournisseur" id="" value="{{ $fournisseur->adresse_fournisseur }}">
        <input type="text" name="phone_fournisseur" id="" value="{{ $fournisseur->phone_fournisseur }}">
        <input type="email" name="email_fournisseur" id="" value="{{ $fournisseur->email_fournisseur }}">
        <input type="submit">
    </form>
</body>
</html>

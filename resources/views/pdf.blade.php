<!DOCTYPE html>
<html>
<head>
    <title>Commande #{{ $commande->id }}</title>
</head>
<body>
    <h1>Commande #{{ $commande->commande_id }}</h1>
    <p>Fournisseur: {{ $commande->fournisseur->nom_fournisseur }}</p>
</body>
</html>

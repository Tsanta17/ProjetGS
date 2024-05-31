<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <H3>Liste des commandes validé</H3>
    <p>nom: {{ $commande->commande_id }}</p>
    <p>status: {{ $commande->statut }}</p>
    <p>date: {{ $commande->article->date_peremption }}</p>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Détails Commande </h1>
    <H5>Commnade : {{ $commande->nom_commande }}</H5>

    <p>nom Site : {{ $commande->site->nom_site }}</p>
    <p>Abonnement : {{ $commande->abonnement }}</p>
    <p>Budget Disponnible : {{ $commande->budget_disponible }}</p>

    <h4>Détail Fournisseur</h4>
    <p>article : {{ $commande->article->nom_article }}</p>
    <p>Réference Article : {{ $commande->article->reference }}</p>
    <h4>Détail Fournisseur</h4>
    <p>nom Fournisseur : {{ $commande->fournisseur->nom_fournisseur }}</p>

    <form action="{{ route('commande.valider', $commande->commande_id) }}" method="post">
        @csrf
        @method('PATCH')
        <h4>Insertion dans commandes lignes</h4>
        <input type="text" name="quantite" placeholder="quantite" id="">
        <input type="text" name="prix_unitaire" placeholder="prix unitaire" id="">
        <button type="submit">Valider commande</button>
    </form>
    <form action="{{ route('commande.attente', $commande->commande_id) }}" method="post">
        @csrf
        @method('PATCH')
        <button type="submit">Mettre en attente</button>
    </form>
</body>
</html>

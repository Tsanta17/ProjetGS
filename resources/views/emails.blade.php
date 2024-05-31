<!DOCTYPE html>
<html lang="en">
<head>
    <title>Votre commande</title>
</head>
<body>
    <p>Bonjour {{ $commande->fournisseur->nom_fournisseur }}</p>
    <p>veuillez trouver ci-joint votre commande numéro {{ $commande->commande_id }}</p>
    <p>Merci de nous fournir les artices dans les plus brefs détails.</p>
    <p>Cordialement,</p>
    <p>L'equipe de gestion des commandes</p>
</body>
</html>

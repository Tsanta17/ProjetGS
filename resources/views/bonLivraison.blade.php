<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LIVRAISON</title>
</head>
<body>
    <h1>Liste commande qui est en attente de livraison</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th> commande_id</th>
                <th>date_livraison</th>
                <th>numero_lot</th>
                <th>quantite</th>
                <th>Date de peremption</th>
                <th>
                    <div>
                        Accepter
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            @foreach ($listeLivraisonAttente as $listeLivraisonAttente)
                <tr>
                    <td>{{$listeLivraisonAttente->livraison_id}}</td>
                    <td>{{$listeLivraisonAttente->commande_id}}</td>
                    <td>{{$listeLivraisonAttente->date_livraison}}</td>
                    <td>{{$listeLivraisonAttente->numero_lot}}</td>
                    <td>{{$listeLivraisonAttente->quantite}}</td>
                    <td>
                    <div>
                        <form action="{{ route('livraison.update',$listeLivraisonAttente->livraison_id) }}" method="POST">
                            @csrf
                            <input type="date" name="date_peremption">
                            <input type="submit">
                        </form>
                    </div>
                    <td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <hr>
    <hr>
    <h1>Liste commande qui est valider de livraison</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th> commande_id</th>
                <th>date_livraison</th>
                <th>numero_lot</th>
                <th>quantite</th>
                
            </tr>
        </thead>
        <tbody>
            @foreach ($listeLivraisonValider as $listeLivraisonValider)
                <tr>
                    <td>{{$listeLivraisonValider->livraison_id}}</td>
                    <td>{{$listeLivraisonValider->commande_id}}</td>
                    <td>{{$listeLivraisonValider->date_livraison}}</td>
                    <td>{{$listeLivraisonValider->numero_lot}}</td>
                    <td>{{$listeLivraisonValider->quantite}}</td>
                    
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Commande</title>
</head>

<body>
    <h1>Ajouter un Commande</h1>
    <p>
        @if(session()->has('success'))
    <div class="alert alert-success bg-success text-light border-0 alert-dismissible fade show" role="alert">
        {{session()->get('success')}}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close">X</button>
    </div>
    @endif
    </p>

    <form action="{{ url('ajoutCommande') }}" method="POST">
        @csrf
        <div>
            <label for="reference">Reference</label>
            <input type="text" name="reference" id="reference" required>
        </div>
        <div>
            <label for="reference">Article</label>
            <input type="text" name="nom_article" id="article" required>
        </div>
        <div>
            <label for="description">Description</label>
            <textarea name="description" id="description"></textarea>
        </div>
        <div>
            <label for="date_commande">Date de commande</label>
            <input type="date" name="date_commande" id="date_commande">
        </div>
        <div>
            <label for="budget_disponible">Budget</label>
            <input type="number" name="budget_disponible" id="budget_disponible" required>
        </div>
        <button type="submit">Commander</button>
    </form>
    <hr>
    <span><b>Liste des commandes</b></span>
    <br>
    <table border="1">
        <tr>
            <th>Article</th>
            <th>Déscription</th>
            <th>Reference</th>
            <th>Date commande</th>
            <th>Site</th>
            <th>Département</th>
            <th>Statut</th>


        </tr>
        @foreach($listeCommandes as $data)
        <tr>
            <td>{{$data->nom_article}}</td>
            <td>{{$data->description}}</td>
            <td>{{$data->reference}}</td>
            <td>{{$data->date_commande}}</td>
            <td>{{Auth::user()->site}}</td>
            <td>{{$data->departement}}</td>
            <td>{{$data->statut}}</td>
            @if (Auth::user()->departement == $data->departement)
            <td><button>Demander</button></td>
            @endif

        </tr>
        @endforeach




    </table>
    <hr>

</body>

</html>
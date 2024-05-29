<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <span><b>MODIFICATION</b></span>
    <form action="{{ url('updateArticle',$data->article_id) }}" method="POST">
        @csrf
        <div>
            <label for="reference">Référence</label>
            <input type="text" name="reference" value="{{$data->reference}}" required>
        </div>
        <div>
            <label for="nom">Nom</label>
            <input type="text" name="nom" value="{{$data->nom}}" required>
        </div>
        <div>
            <label for="description">Description</label>
            <textarea name="description" value="{{$data->description}}"></textarea>
        </div>
        <div>
            <label for="date_peremption">Date de Péremption</label>
            <input type="date" name="date_peremption" value="{{$data->date_peremption}}" id="date_peremption">
        </div>

        <div>
            <label for="fournisseur_id">Fournisseur ID</label>
            <input type="number" name="fournisseur_id" value="{{$data->fournisseur_id}}" id="fournisseur_id" required>
        </div>

        <div>
            <label for="site_id">Site ID</label>
            <input type="number" name="site_id" value="{{$data->site_id}}" id="site_id" required>
        </div>
        <button type="submit">Modifier</button>
    </form>


</body>

</html>
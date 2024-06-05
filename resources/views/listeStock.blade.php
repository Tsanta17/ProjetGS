<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Stock</title>
</head>
<body>
    <h1>Liste de stock</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id_stock</th>
                <th>Article_ID</th>
                <th>Nom Article</th>
                <th>Site_ID</th>
                <th>Quantite</th>
                <th>Date de peremption</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($listeStock as $listeStock)
                <tr>
                    <td>{{$listeStock->stock_id}}</td>
                    <td>{{$listeStock->article_id}}</td>
                    <td>{{$listeStock->nom_article}}</td>
                    <td>{{$listeStock->site_id}}</td>
                    <td>{{$listeStock->quantite}}</td>
                    <td>{{$listeStock->date_peremption}}</td>
                </tr>
            @endforeach
         
        </tbody>
    </table>
    <hr>
    <hr>


    <form action="">
        <label for="">Nom Article</label>
        <input type="text" name="nom_article">
        <br>
        <br>
        <label for="">Quantite</label>
        <input type="text" name="quantite" value="">
        <br>
        <br>
        
        <input type="submit">

    </form>

  
</body>
</html>
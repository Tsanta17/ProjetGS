<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Stock</title>
</head>
<body>

    <hr>
    <hr>

    <h1>Liste de stock perer</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th>Article_ID</th>
                <th>Nom article</th>
                <th>Site_ID</th>
                <th>Quantite</th>
                <th>Date de peremption</th>
                <th>Action</th>
                
            </tr>
        </thead>
        <tbody>
            @foreach ($listeStockperime as $listeStockperime)
                <tr>
                    <td>{{$listeStockperime->stock_id}}</td>
                    <td>{{$listeStockperime->article_id}}</td>
                    <td>{{$listeStockperime->nom_article}}</td>
                    <td>{{$listeStockperime->site_id}}</td>
                    <td>{{$listeStockperime->quantite}}</td>
                    <td><img src="{{$listeStockperime->code_barre}}" alt="Code barre"></td>
                    
                    <td>{{$listeStockperime->date_peremption}}</td>
                    <td><a href="{{ route('deleteStockPerime',$listeStockperime->stock_id) }}" 
                        onclick="return confirm('are you sure to delete {{$listeStockperime->nom_article}}')">
                        supprimer</a></td>
                </tr>
            @endforeach
         
        </tbody>
    </table>

<hr>
<hr>
<hr>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th>Article_ID</th>
                <th>Nom article</th>
                <th>Site_ID</th>
                <th>Quantite</th>
                <th>Date de peremption</th>
                <th>Action</th>
                
            </tr>
        </thead>
        <tbody>
            @foreach ($listeStockperimes as $listeStockperimes)
                <tr>
                    <td>{{$listeStockperimes->stock_id}}</td>
                    <td>{{$listeStockperimes->article_id}}</td>
                    <td>{{$listeStockperimes->article->nom_article}}</td>
                    <td>{{$listeStockperimes->site_id}}</td>
                    <td>{{$listeStockperimes->quantite}}</td>
                    <td>{{$listeStockperimes->article->date_peremption}}</td>
                    <td><a href="{{ route('deleteStockPerime',$listeStockperimes->stock_id) }}" 
                        onclick="return confirm('are you sure to delete {{$listeStockperimes->article->nom_article}}')">
                        supprimer</a></td>
                </tr>
            @endforeach
         
        </tbody>
    </table>
   
    
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>Liste Stock</h1>
    <table style="border: 2px solid black; border-collapse: collapse">
        <thead style="border: 2px solid black">
            <tr>
                <th>Id</th>
                <th>Article Id</th>
                <th>Site id</th>
                <th>Departement</th>
                <th>Quantite</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($stocks as $stock)
                <tr>
                    <td>{{$stock->stock_id}}</td>
                    <td>{{$stock->article_id}}</td>
                    <td>{{$stock->site_id}}</td>
                    <td>{{$stock->departement}}</td>
                    <td>{{$stock->quantite}}</td>
                    <td><a href="{{ route('stock.show', $stock->stock_id) }}">Demmander une affectation</a></td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

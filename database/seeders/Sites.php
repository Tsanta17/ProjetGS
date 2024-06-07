<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Site;

class Sites extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Site::create([
            'nom_site' => 'Ploufragan',
            'adresse_site' => '122 Pl',
        ]);

        Site::create([
            'nom_site' => 'Quimper',
            'adresse_site' => '123 Pl',
        ]);

        Site::create([
            'nom_site' => 'Brest',
            'adresse_site' => '124 Pl',
        ]);

        Site::create([
            'nom_site' => 'Fougères',
            'adresse_site' => '125 Pl',
        ]);

        Site::create([
            'nom_site' => 'Combourg',
            'adresse_site' => '126 Pl',
        ]);
    }
}

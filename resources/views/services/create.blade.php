t\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 {main}

[previous exception] [object] (PDOException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'sites' already exists at E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:587)
[stacktrace]
#0 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(587): PDOStatement->execute()
#1 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(816): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `s...', Array)
#2 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(783): Illuminate\\Database\\Connection->runQueryCallback('create table `s...', Array, Object(Closure))
#3 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(588): Illuminate\\Database\\Connection->run('create table `s...', Array, Object(Closure))
#4 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(110): Illuminate\\Database\\Connection->statement('create table `s...')
#5 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(602): Illuminate\\Database\\Schema\\Blueprint->build(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Schema\\Grammars\\MySqlGrammar))
#6 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(460): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(355): Illuminate\\Database\\Schema\\Builder->create('sites', Object(Closure))
#8 E:\\BOSSY\\WORKSPACE\\ProjetGS\\database\\migrations\\2024_05_29_122947_create_sites_table.php(19): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 E:\\BOSSY\\WORKSPACE\\ProjetGS\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(493): Illuminate\\
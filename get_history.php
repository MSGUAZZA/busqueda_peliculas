<?php
// Leer el archivo JSON con el historial de películas o series
$history = file_get_contents('movies.json');
// Devolver el historial al frontend
echo $history;
?>

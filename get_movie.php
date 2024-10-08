<?php
if (isset($_POST['title'])) {
    $title = urlencode($_POST['title']);
    $apiKey = 'TU_API_KEY'; // Reemplaza con tu clave API de OMDb
    // Hacer la solicitud a la API de OMDb
    $apiUrl = "http://www.omdbapi.com/?t={$title}&apikey={$apiKey}";

    // Obtener la respuesta de la API
    $movieData = file_get_contents($apiUrl);
    $movie = json_decode($movieData, true);

    // Si la película o serie se encuentra, guardarla en el historial
    if ($movie['Response'] === "True") {
        // Leer el archivo JSON
        $history = json_decode(file_get_contents('movies.json'), true);
        
        // Añadir la película o serie al historial
        $history[] = [
            "title" => $movie['Title'],
            "year" => $movie['Year'],
            "type" => $movie['Type'],
            "director" => $movie['Director'] ?? "N/A",
            "actors" => $movie['Actors']
        ];
        
        // Guardar el historial actualizado en el archivo JSON
        file_put_contents('movies.json', json_encode($history, JSON_PRETTY_PRINT));

        // Si es una serie, buscar temporadas y episodios
        if ($movie['Type'] === 'series') {
            $totalSeasons = $movie['totalSeasons'];
            $movie['Seasons'] = [];

            // Obtener información de cada temporada
            for ($i = 1; $i <= $totalSeasons; $i++) {
                $seasonUrl = "http://www.omdbapi.com/?t={$title}&Season={$i}&apikey={$apiKey}";
                $seasonData = file_get_contents($seasonUrl);
                $season = json_decode($seasonData, true);
                $movie['Seasons'][] = $season;
            }
        }
    }
    // Devolver los datos de la película o serie al frontend
    echo json_encode($movie);
}
?>

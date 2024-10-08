$(document).ready(function () {
    // Función para obtener el historial de búsquedas
    function getHistory() {
        $.ajax({
            url: 'get_history.php',
            method: 'GET',
            success: function (response) {
                let history = JSON.parse(response);
                let historyList = '';
                history.forEach(function (movie) {
                    historyList += `<li class="list-group-item">${movie.title} (${movie.year})</li>`;
                });
                $('#historyList').html(historyList);
            }
        });
    }

    // Cargar el historial cuando se carga la página
    getHistory();

    // Manejar la búsqueda de película o serie
    $('#movieForm').on('submit', function (e) {
        e.preventDefault();
        let title = $('#title').val();
        if (title) {
            $.ajax({
                url: 'get_movie.php',
                method: 'POST',
                data: { title: title },
                success: function (response) {
                    let movie = JSON.parse(response);
                    if (movie.Response === "True") {
                        $('#movieResult').html(`
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${movie.Poster}" alt="Póster de ${movie.Title}" class="img-fluid">
                                </div>
                                <div class="col-md-8">
                                    <h3>${movie.Title} (${movie.Year})</h3>
                                    <p><strong>Director:</strong> ${movie.Director}</p>
                                    <p><strong>Actores:</strong> ${movie.Actors}</p>
                                    <p><strong>Sinopsis:</strong> ${movie.Plot}</p>
                                </div>
                            </div>
                        `);

                        // Mostrar temporadas si es una serie
                        if (movie.Type === 'series') {
                            let seasonsHtml = '<h4>Temporadas</h4>';
                            movie.Seasons.forEach(function(season) {
                                seasonsHtml += `<h5>Temporada ${season.Season}</h5><ul>`;
                                season.Episodes.forEach(function(episode) {
                                    seasonsHtml += `<li>${episode.Episode}: ${episode.Title} (${episode.Released})</li>`;
                                });
                                seasonsHtml += '</ul>';
                            });
                            $('#movieResult').append(seasonsHtml); // Agregar temporadas y episodios
                        }

                        getHistory(); // Actualizar historial
                    } else {
                        $('#movieResult').html(`<p class="text-danger">Película o serie no encontrada.</p>`);
                    }
                }
            });
        }
    });
});

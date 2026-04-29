async function loadHomePageMovies() {
  try {
    const popularMovies = await fetchPopularMovies();
    renderMoviePosters('#popular', popularMovies);

    const trendingMovies = await fetchTrendingMovies();
    renderMoviePosters('#trending', trendingMovies);
  } catch (error) {
    console.error(error.message);
  }
}

function renderMoviePosters(containerName, movies) {
  const container = document.querySelector(containerName);
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
    <article class="movie-card position-relative overflow-hidden">
      <img class="w-100" src="${movie.poster}" alt="${movie.title}">
      <footer class="movie-card-overlay position-absolute bottom-0 start-0 end-0">
        <h3 class="fs-5 fw-bold mx-3">${movie.title}</h3>
        <p class="mx-3">${movie.overview.substring(0, 50)}...</p>
      </footer>
    </article>`;

    container.appendChild(col);
  });
}

loadHomePageMovies();
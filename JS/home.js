async function loadHomePageMovies() {
  const popularContainer = document.querySelector('#popular');
  const trendingContainer = document.querySelector('#trending');
  popularContainer.innerHTML = `<div class="col-12 text-center"><div class="spinner-border" role="status"></div></div>`;
  trendingContainer.innerHTML = `<div class="col-12 text-center"><div class="spinner-border" role="status"></div></div>`;
  try {
    const popularMovies = await fetchPopular();
    renderMoviePosters('#popular', popularMovies);

    const trendingMovies = await fetchTrending();
    renderMoviePosters('#trending', trendingMovies);
  } catch (error) {
    showError('#popular');
    showError('#trending');
  }
}

function showError(containerName) {
  const container = document.querySelector(containerName);
  if (!container) return;
  container.innerHTML = `
    <div class="col-12">
      <p class="text-danger">
        <i class="bi bi-exclamation-circle me-2"></i>
        ${t('home', 'loadError')}
      </p>
    </div>`;
}

function renderMoviePosters(containerName, movies) {
  console.log(movies)
  const container = document.querySelector(containerName);
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
    <a href="title/?media_type=${movie.media_type}&id=${movie.id}" class="text-decoration-none text-white">
      <article class="movie-card position-relative overflow-hidden">
        <img class="w-100" src="${movie.poster}" alt="${movie.title}">
        <footer class="movie-card-overlay position-absolute bottom-0 start-0 end-0">
          <h3 class="fs-5 fw-bold mx-3">${movie.title}</h3>
          <p class="mx-3">${movie.overview.substring(0, 50)}...</p>
        </footer>
      </article>
    </a>`;

    container.appendChild(col);
  });
}

loadHomePageMovies();
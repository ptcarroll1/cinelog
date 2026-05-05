function loadWatchlistPage() {
  const movies = getWatchlistMovies();
  const container = document.getElementById('watchlistResults');

  if (!container) return;

  container.innerHTML = '';

  if (movies.length === 0) {
    container.innerHTML = `<p>${t('watchlist', 'empty')}</p>`;
    return;
  }

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
  <a href="../title/?media_type=${movie.media_type}&id=${movie.id}" class="text-decoration-none text-white">
  <article class="movie-card position-relative overflow-hidden">
    <img class="w-100" src="${movie.poster}" alt="${movie.title}">
    <footer class="movie-card-overlay position-absolute bottom-0 start-0 end-0">
      <h3 class="fs-5 fw-bold mx-3">${movie.title}</h3>
      <p class="mx-3">${movie.overview ? movie.overview.substring(0, 50) + '...' : ''}</p>
      <button class="btn btn-sm btn-outline-light remove-btn mx-3 mb-2" aria-label="Remove ${movie.title} from library">Remove</button>
    </footer>
  </article>
  </a>
  `;
  const removeBtn = col.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeMovieFromWatchlist(movie.id);
      loadWatchlistPage();
    });

    container.appendChild(col);
  });
    
}

loadWatchlistPage();
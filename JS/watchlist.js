function loadWatchlistPage() {
  const movies = getWatchlistMovies();
  const container = document.getElementById('watchlistResults');

  if (!container) return;

  container.innerHTML = '';

  if (movies.length === 0) {
    container.innerHTML = '<p>No movies in your watchlist yet.</p>';
    return;
  }

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <article class="movie-card position-relative overflow-hidden">
        <img class="w-100" src="${movie.poster}" alt="${movie.title}">
        <footer class="p-2">
          <h2 class="fs-6 fw-bold mb-1">${movie.title}</h2>
          <p class="small text-secondary mb-2">${movie.year}</p>
          <button class="btn btn-sm btn-outline-light remove-btn" aria-label="Remove ${movie.title} from watchlist">Remove</button>
        </footer>
      </article>
    `;

    const removeBtn = col.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      removeMovieFromWatchlist(movie.id);
      loadWatchlistPage();
    });

    container.appendChild(col);
  });
}

loadWatchlistPage();
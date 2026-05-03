function loadLibraryPage() {
  const movies = getLibraryMovies();
  const container = document.getElementById('libraryResults');

  if (!container) return;

  container.innerHTML = '';

  if (movies.length === 0) {
    container.innerHTML = '<p>No movies in your library yet.</p>';
    return;
  }

  movies.forEach(movie => {
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
    <a href="../title/?media_type=${movie.media_type}&id=${movie.id}" class="text-decoration-none text-white">
      <article class="movie-card position-relative overflow-hidden">
        <img class="w-100" src="${movie.poster}" alt="${movie.title}">
        <footer class="p-2">
          <h2 class="fs-6 fw-bold mb-1">${movie.title}</h2>
          <p class="small text-secondary mb-2">${movie.year}</p>
          <button class="btn btn-sm btn-outline-light remove-btn" aria-label="Remove ${movie.title} from library">Remove</button>
        </footer>
      </article>
    </a>
    `;

    container.appendChild(col);
  });
}

loadLibraryPage();
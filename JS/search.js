const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const placeholderPoster = '';

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = '';
    return;
  }

  try {
    const movies = await searchMovies(query);
    searchResults.innerHTML = '';
    movies.slice(0, 5).forEach(movie => {
      const result = document.createElement('div');
      result.className = 'd-flex align-items-start gap-3 py-3 border-bottom border-secondary-subtle';

      const img = document.createElement('img');
      img.className = 'search-result-thumb rounded-2 flex-shrink-0';
      img.src = movie.poster ?? placeholderPoster;
      img.alt = movie.title;

      const info = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'fw-semibold mb-1';
      title.textContent = movie.title;

      const year = document.createElement('div');
      year.className = 'small text-secondary mb-2';
      year.textContent = movie.year;

      const addToLibrary = document.createElement('a');
      addToLibrary.href = '#';
      addToLibrary.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
      addToLibrary.textContent = '+ Add to Library';

      // Add event listener to handle adding movie to library
      addToLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        const added = addMovieToLibrary(movie);
        addToLibrary.textContent = added ? 'Added to Library' : 'Already in Library';
        });
      const addToWatchlist = document.createElement('a');
      addToWatchlist.href = '#';
      addToWatchlist.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
      addToWatchlist.textContent = '+ Add to Watchlist';

      // Add event listener to handle adding movie to watchlist
      addToWatchlist.addEventListener('click', (e) => {
        e.preventDefault();
        const added = addMovieToWatchlist(movie);
        addToWatchlist.textContent = added ? 'Added to Watchlist' : 'Already in Watchlist';
        });

      info.append(title, year, addToLibrary, addToWatchlist);
      result.append(img, info);
      searchResults.appendChild(result);
    });
  } catch (err) {
    searchResults.innerHTML = '';
  }
});

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const placeholderPoster = '';
if (searchInput) {
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();

  if (!query) {
    searchResults.innerHTML = '';
    return;
  }
  searchResults.innerHTML = `<div class="text-center py-4"><div class="spinner-border" role="status"></div></div>`;


  try {
    const movies = await searchTMDB(query);
    searchResults.innerHTML = '';
    movies.slice(0, 5).forEach(movie => {
      const result = document.createElement('article');
      result.className = 'd-flex align-items-start gap-3 py-3 border-bottom border-secondary-subtle';

      const img = document.createElement('img');
      img.className = 'search-result-thumb rounded-2 flex-shrink-0';
      img.src = movie.poster ?? placeholderPoster;
      img.alt = movie.title;

      const info = document.createElement('div');
      const title = document.createElement('h2');
      title.className = 'fw-semibold mb-1';
      title.textContent = movie.title;

      const year = document.createElement('p');
      year.className = 'small text-secondary mb-2';
      year.textContent = movie.year;

      const actions = document.createElement('footer');

      const addToLibrary = document.createElement('a');
      addToLibrary.href = '#';
      addToLibrary.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
      addToLibrary.textContent = '+ Add to Library';

      addToLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        const added = addMovieToLibrary(movie);
        addToLibrary.textContent = added ? 'Added to Library' : 'Already in Library';
        });
      const addToWatchlist = document.createElement('a');
      addToWatchlist.href = '#';
      addToWatchlist.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
      addToWatchlist.textContent = '+ Add to Watchlist';

      addToWatchlist.addEventListener('click', (e) => {
        e.preventDefault();
        const added = addMovieToWatchlist(movie);
        addToWatchlist.textContent = added ? 'Added to Watchlist' : 'Already in Watchlist';
        });

      actions.append(addToLibrary, addToWatchlist);
      info.append(title, year, actions);
      result.append(img, info);
      searchResults.appendChild(result);
    });
  } catch (err) {
    searchResults.innerHTML = '';
  }
});
}

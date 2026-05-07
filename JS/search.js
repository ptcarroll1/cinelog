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
    searchResults.innerHTML = `<div class="text-center py-4"><div class="spinner-border" role="status" aria-label="${t('search', 'searching')}"><span class="visually-hidden">${t('search', 'searching')}</span></div></div>`;


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

        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
        window.location.href = `../title/?media_type=${movie.media_type}&id=${movie.id}`;
        });

        const info = document.createElement('div');
        const titleLink = document.createElement('a');
        titleLink.href = `../title/?media_type=${movie.media_type}&id=${movie.id}`;
        titleLink.className = 'text-decoration-none text-body';

        const title = document.createElement('h2');
        title.className = 'fw-semibold mb-1';
        title.textContent = movie.title;
        titleLink.appendChild(title);

        const year = document.createElement('p');
        year.className = 'small text-secondary mb-2';
        year.textContent = movie.year;

        const actions = document.createElement('footer');

        const inLibrary = getLibraryMovies().some(m => m.id === movie.id);
        const inWatchlist = getWatchlistMovies().some(m => m.id === movie.id);

        const addToLibrary = document.createElement('a');
        addToLibrary.className = 'search-result-action d-block small text-decoration-none lh-lg';

        const addToWatchlist = document.createElement('a');
        addToWatchlist.className = 'search-result-action d-block small text-decoration-none lh-lg';

        syncButtons(addToLibrary, addToWatchlist, inLibrary, inWatchlist);

        addToLibrary.addEventListener('click', (e) => {
          e.preventDefault();
          addMovieToLibrary(movie);
          syncButtons(addToLibrary, addToWatchlist, true, false);
        });

        addToWatchlist.addEventListener('click', (e) => {
          e.preventDefault();
          addMovieToWatchlist(movie);
          const key = `${movie.media_type}_${movie.id}`;
          const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
          delete ratings[key];
          localStorage.setItem('ratings', JSON.stringify(ratings));
          const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
          delete reviews[key];
          localStorage.setItem('reviews', JSON.stringify(reviews));
          syncButtons(addToLibrary, addToWatchlist, false, true);
        });

        actions.append(addToLibrary, addToWatchlist);
        info.append(titleLink, year, actions);
        result.append(img, info);
        searchResults.appendChild(result);
      });
    } catch (err) {
      searchResults.innerHTML = '';
    }
  });
}

function syncButtons(addToLibrary, addToWatchlist, libActive, watchActive) {
  if (libActive) {
    addToLibrary.textContent = t('search', 'alreadyInLibrary');
    addToLibrary.removeAttribute('href');
    addToLibrary.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
    addToWatchlist.textContent = t('search', 'addToWatchlist');
    addToWatchlist.href = '#';
    addToWatchlist.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
  } else if (watchActive) {
    addToWatchlist.textContent = t('search', 'alreadyInWatchlist');
    addToWatchlist.removeAttribute('href');
    addToWatchlist.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
    addToLibrary.textContent = t('search', 'addToLibrary');
    addToLibrary.href = '#';
    addToLibrary.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
  } else {
    addToLibrary.textContent = t('search', 'addToLibrary');
    addToLibrary.href = '#';
    addToLibrary.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
    addToWatchlist.textContent = t('search', 'addToWatchlist');
    addToWatchlist.href = '#';
    addToWatchlist.className = 'search-result-action d-block small text-secondary text-decoration-none lh-lg';
  }
}

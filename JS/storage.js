const LIBRARY_KEY = 'library';
const WATCHLIST_KEY = 'watchlist';

function getStoredMovies(key) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveMovies(key, movies) {
    localStorage.setItem(key, JSON.stringify(movies));
}

function addMovieToStorage(key, movie) {
    const movies = getStoredMovies(key);
    const alreadyExists = movies.some(storedMovie => storedMovie.id === movie.id);
    if (alreadyExists) return false;
    movies.push(movie);
    saveMovies(key, movies);
    return true;
}

function removeMovieFromStorage(key, movieId) {
    const movies = getStoredMovies(key);
    const updatedMovies = movies.filter(movie => movie.id !== movieId);
    saveMovies(key, updatedMovies);
}

function getLibraryMovies() {
    return getStoredMovies(LIBRARY_KEY);
}

function getWatchlistMovies() {
    return getStoredMovies(WATCHLIST_KEY);
}

function addMovieToLibrary(movie) {
    return addMovieToStorage(LIBRARY_KEY, movie);
}

function addMovieToWatchlist(movie) {
    return addMovieToStorage(WATCHLIST_KEY, movie);
}

function removeMovieFromLibrary(movieId) {
    removeMovieFromStorage(LIBRARY_KEY, movieId);
}

function removeMovieFromWatchlist(movieId) {
    removeMovieFromStorage(WATCHLIST_KEY, movieId);
}
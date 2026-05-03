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
    return getStoredMovies('library');
}

function getWatchlistMovies() {
    return getStoredMovies('watchlist');
}

function addMovieToLibrary(movie) {
    return addMovieToStorage('library', movie);
}

function addMovieToWatchlist(movie) {
    return addMovieToStorage('watchlist', movie);
}

function removeMovieFromLibrary(movieId) {
    removeMovieFromStorage('library', movieId);
}

function removeMovieFromWatchlist(movieId) {
    removeMovieFromStorage('watchlist', movieId);
}


function getRating(contentKey) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    return ratings[contentKey] || 0;
}

function setRating(contentKey, rating) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (rating === 0) {
        delete ratings[contentKey];
    } else {
        ratings[contentKey] = rating;
    }
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

function getReviews(contentKey) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    return reviews[contentKey] || [];
}

function addReview(contentKey, text) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    if (!reviews[contentKey]) reviews[contentKey] = [];
    reviews[contentKey].unshift({
        id: Date.now(),
        text: text.trim(),
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    });
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function deleteReview(contentKey, reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '{}');
    if (!reviews[contentKey]) return;
    reviews[contentKey] = reviews[contentKey].filter(r => r.id !== reviewId);
    localStorage.setItem('reviews', JSON.stringify(reviews));
}
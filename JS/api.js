const API_KEY = '27fd29c9194d5b82dc85ffa94e9d5e3d';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER_IMAGE = '';

async function fetchMovies(endpoint, params) {
  let url_params = new URLSearchParams(params);
  const url = `${API_URL}${endpoint}?api_key=${API_KEY}&${url_params.toString()}`;
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : PLACEHOLDER_IMAGE,
    overview: movie.overview
  }));
}

async function searchMovies(query) {
  return fetchMovies('/search/movie', {
    query: encodeURIComponent(query)
  });
}

async function fetchPopularMovies() {
  return fetchMovies('/movie/popular', { page: 1 });
}

async function fetchTrendingMovies() {
  return fetchMovies('/trending/all/day', {});
}
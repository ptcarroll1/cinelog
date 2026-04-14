const API_KEY = "b008ed6c";
const API_URL = "https://www.omdbapi.com/";


async function fetchMovieData(title) {
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(`API error! message: ${data.Error}`);
  }
  return data.Search.map(movie => ({
    imdbID: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster
  }));
}

async function searchMovies(query) {
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error(data.Error);
  }

  return data.Search.map(movie => ({
    imdbID: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: movie.Poster
  }));
}
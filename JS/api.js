const API_KEY = "27fd29c9194d5b82dc85ffa94e9d5e3d";
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


async function fetchMovieData(title) {
  const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  
  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : "Unknown",
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "assets/images/placeholder.png",
    overview: movie.overview
  }));
}
  
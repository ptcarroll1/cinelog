async function loadHomePageMovies() {
  try {
    const movies = await fetchPopularMovies();
    renderMoviePosters(movies);
  } catch (error) {
    console.error(error.message);
  }
}

function renderMoviePosters(movies) {
  const container = document.querySelector("#popular-movies");
  if (!container) return;
  container.innerHTML = "";

  movies.forEach(movie => {
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
     <article class="movie-card">
     <img src="${movie.poster}" alt="Poster for ${movie.title}">
     <h2>${movie.title}</h2>
    </article>
    `;

container.appendChild(col);
  });
}

loadHomePageMovies();